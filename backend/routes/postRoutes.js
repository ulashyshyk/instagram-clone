import express, { json } from 'express'
import { verifyToken } from '../models/verifyToken.js'
import { uploadPost } from '../models/postUpload.js'
import Post from '../models/postModel.js'
import User from '../models/user.model.js'
import Notification from '../models/notificationModel.js'
const router = express.Router()

router.get('/post',verifyToken,async (req,res)=>{
    try {
        const userId = req.user.id
        const posts = await Post.find({author:userId}).sort({createdAt:-1})
        res.status(200).json({posts})
    } catch (error) {
        console.error('Failed to fetch user posts: ',error)
        res.status(500).json({message:'Server error'})
    }
})
router.post('/post', verifyToken, uploadPost.array("media"), async (req, res) => {
  try {
    const { description } = req.body
    const userId = req.user.id
    const files = req.files

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "At least one media file is required" })
    }

    const media = files.map(file => ({
      url: file.path,
      type: file.mimetype.startsWith('video') ? 'video' : 'image'
    }))

    const initialComments = description
      ? [{ user: userId, text: description }]
      : []

    const newPost = new Post({
      description,
      media,
      author: userId,
      comments: initialComments
    })

    const savedPost = await newPost.save()

    await User.findByIdAndUpdate(userId, {
      $push: { posts: savedPost._id }
    })

    res.status(201).json({
      message: "Post created successfully",
      post: savedPost
    })
  } catch (error) {
    console.error("Error creating post:", error)
    res.status(500).json({ message: "Failed to create post." })
  }
})

router.delete('/post/:postId',verifyToken,async(req,res) => {
  const {postId} = req.params

  const post = await Post.findById(postId)

  if(!post){
    return res.status(404).json({message:'Post not found'})
  }
  if(post.author.toString() !== req.user.id){
    return res.status(403).json({message:'Not authorized'})
  }

  await Post.findByIdAndDelete(postId)
  
  res.status(200).json({message:'Post deleted successfully'})
})

router.put('/post/:postId',verifyToken,async(req,res) => {
  const {postId} = req.params
  const {description} = req.body

  const post = await Post.findById(postId)

  if(!post){
    return res.status(404).json({message:'Post not found'})
  }
  if(post.author.toString() !== req.user.id){
    return res.status(403).json({message:'Not authorized'})
  }

  post.description = description
  await post.save()

  return res.status(200).json({success:true,post:post})
})

router.get('/post/:postId', verifyToken, async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId)
        .populate('author', 'username profilePic')
        .populate('comments.user', 'username profilePic')
  
      if (!post) return res.status(404).json({ error: 'Post not found' })
  
      res.status(200).json({ success: true, post })
    } catch (err) {
      console.error('GET post failed:', err)
      res.status(500).json({ error: 'Server error' })
    }
  })
router.post('/comment/:postId',verifyToken,async(req,res) => {
    try {
        
        const {text} = req.body
        const {postId} = req.params

        const post = await Post.findById(postId)
        if(!post){
            return res.status(404).json({error:'Post not found'})
        }

        post.comments.push({ user: req.user.id, text })
        await post.save()
        
        if (req.user.id !== post.author.toString()) {
          const notification = await Notification.create({
            sender: req.user.id,
            receiver: post.author,
            type: "comment",
            post: post._id
          });
          const populated = await notification.populate('sender', 'username profilePic');

          const io = req.app.get('io');
          io.to(populated.receiver.toString()).emit('notify', {
            _id: populated._id,
            sender: {
              _id: populated.sender._id,
              username: populated.sender.username,
              profilePic: populated.sender.profilePic
            },
            type: 'comment',
            post: {
              _id: post._id,
              media: post.media
            },
            createdAt: new Date(),
            isRead: false
          });
        }
        

        await post.populate('comments.user author', 'username profilePic')


        console.log('Populated comments:',post.comments)
        const updatedPost = post
        
        res.status(200).json({ success: true, post: updatedPost })
    } catch (error) {
        console.error('Comment failed:',error)
        res.status(500).json({error:'Server error'})
    }
})

router.delete('/comment/:postId/:commentId', verifyToken, async (req, res) => {
    const { postId, commentId } = req.params
  
    try {
      const post = await Post.findById(postId)
  
      if (!post) return res.status(404).json({ error: 'Post not found' })
  
      if (post.author.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to delete comments on this post' })
      }
  
      post.comments = post.comments.filter(
        (comment) => comment._id.toString() !== commentId
      )
  
      await post.save()
      
      await post.populate([
        { path: 'comments.user', select: 'username profilePic' },
        { path: 'author', select: 'username profilePic' }, // ✅ Add this
      ])  
      res.status(200).json({ success: true, post })
    } catch (err) {
      console.error('Delete comment failed:', err)
      res.status(500).json({ error: 'Server error' })
    }
  })

router.put('/like/:postId',verifyToken,async(req,res) => {
  const {postId} = req.params
  const userId = req.user.id

  try {
    const post = await Post.findById(postId)
    if(!post) {
      return res.status(404).json({message:'Post not found'})
    }

    const liked = post.likes.includes(userId)

    if(liked){
      post.likes = post.likes.filter((id) => id.toString() !== userId)
    }else{
      post.likes.push(userId)

      if (userId !== post.author.toString()) {
        const notification = await Notification.create({
          sender: userId,
          receiver: post.author,
          type: "like",
          post: post._id
        });
      
        const populated = await notification.populate('sender', 'username profilePic');

        const io = req.app.get('io');
        io.to(populated.receiver.toString()).emit('notify', {
          _id: populated._id,
          sender: {
            _id: populated.sender._id,
            username: populated.sender.username,
            profilePic: populated.sender.profilePic
          },
          type: 'like',
          post: {
            _id: post._id,
            media: post.media
          },
          createdAt: new Date(),
          isRead: false
        });
      }
      
    }

    await post.save()

    res.status(200).json({ success: true, liked: !liked, post })
  } catch (error) {
    console.error('Like failed:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/feed',verifyToken,async(req,res) => {
  try {
    const userId = req.user.id

    const user = await User.findById(userId)
    if(!user){
      return res.status(404).json({message:"User not found"})
    }

    const following = user.following

    const posts = await Post.find({author: {$in:following}})
      .sort({createdAt:-1})
      .populate('author', 'username profilePic')
      .populate('comments.user', 'username profilePic')

    const formattedPosts = posts.map(post => ({
      ...post.toObject()
    }))

    res.status(200).json({ success: true, posts:formattedPosts });

    } catch (error) {
      console.error('Fetching feed failed:', error);
      res.status(500).json({ message: 'Server error' });
    }
})
export default router;