import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import profile_pic from '../assets/profile_pic.jpg'
import { HiDotsHorizontal } from "react-icons/hi";
import CommentSection from './CommentSection'
import PostActions from './PostActions'
import CommentInput from './CommentInput'
import axios from 'axios'
import { useRef } from 'react'
import { usePost } from '../context/PostContext'
import PostActionModal from './PostActionModal'
import { useToast } from '@chakra-ui/react'

const PostView = ({ setIsModalOpen,post : initialPost,onPostDeleted }) => {
  const {user} = useAuth()
  const {deleteComment} = usePost()
  const [post,setPost] = useState(initialPost)
  const commentInputRed = useRef()
  const [showPostMenu, setShowPostMenu] = useState(false)
  const [editing, setEditing] = useState(false)
  const [descDraft, setDescDraft] = useState(post.description)
  const [mediaIndex,setMediaIndex] = useState(0)
  const toast = useToast()
  const handleDeleteComment = async (commentId) => {
    try {
      const updatedPost = await deleteComment(post._id, commentId)
      setPost(prev => ({
        ...updatedPost,
        author:prev.author
      }))
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const handleDeletePost = async () => {
    const token = localStorage.getItem("accessToken")
    try {
      await axios.delete(`http://localhost:5001/api/posts/post/${post._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      onPostDeleted?.(post._id) 
      setShowPostMenu(false)       
      setIsModalOpen(false)   
      toast({
        title: "Post deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top"
      });    
    } catch (err) {
      toast({
        title: "Error",
        description:"An error occurred. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });      
      console.error('Delete post failed:', err)
    }
  }

  const handleEditPost = async () => {
    const token = localStorage.getItem("accessToken")
    const response = await axios.put(`http://localhost:5001/api/posts/post/${post._id}`, 
      {description:descDraft },
      {headers: { Authorization: `Bearer ${token}` } }
    )
    setPost(response.data.post)
    setEditing(false)
  }
  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${scrollbarWidth}px`
    
    return () => {
        document.body.style.overflow = 'auto'
        document.body.style.paddingRight = '0px'
    }
  }, [])

  useEffect(() => {
    const fetchFullPost = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        const res = await axios.get(
          `http://localhost:5001/api/posts/post/${initialPost._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setPost(res.data.post)
      } catch (err) {
        console.error('Failed to fetch full post:', err)
      }
    }
  
    fetchFullPost()
  }, [initialPost._id])

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[10001] bg-black bg-opacity-70 flex items-center justify-center">
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-3 right-3 text-white  bg-opacity-50 px-2 py-1  hover:bg-opacity-70 transition"
        >
        ✕
      </button>
      <div className="bg-white shadow-lg flex lg:w-[1100px] lg:h-[630px] overflow-hidden relative">
        <div className='relative w-[60%] h-full'>
          {post.media?.[mediaIndex]?.type === 'video' ? (
            <video src={post.media[mediaIndex].url} controls className='w-full h-full object-cover' />
          ) : (
            <img src={post.media[mediaIndex].url} className='w-full h-full object-cover' />
          )}

          {mediaIndex > 0 && (
            <button
              onClick={() => setMediaIndex(prev => prev -1)}
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full"
            >
            ←
            </button>
          )}

          {mediaIndex < post.media.length - 1 && (
            <button
              onClick={() => setMediaIndex(prev => prev + 1)}
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full"
            >→</button>
          )}
        </div>


        <div className="w-[40%] h-full flex flex-col ">
          <div className='flex flex-row p-4 items-center justify-between'>
            <div className='flex flex-row mb-2 items-center gap-3'>
              <img className='w-[40px] h-[40px] rounded-full object-cover cursor-pointer'  src={user.profilePic || profile_pic}/>
              <p className='pb-3 cursor-pointer hover:text-gray-500'>{user.username}</p>
              {editing && (
              <div className="px-4 py-2">
                <textarea
                  className="w-full border rounded p-2 text-sm"
                  value={descDraft}
                  onChange={(e) => setDescDraft(e.target.value)}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleEditPost}
                    className="text-blue-500 font-semibold"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="text-gray-500 text-black ml-5 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            </div>     
            <button onClick={() => setShowPostMenu(true)} className='pb-3 text-xl hover:text-gray-500'><HiDotsHorizontal /></button>
          </div>
          <p className="border-t border-gray-200 w-full -mt-3"></p>

        {showPostMenu && (
          <PostActionModal 
            onDelete={handleDeletePost}
            onEdit={() => {
              setEditing(true)
              setShowPostMenu(false)
            }}
            onClose={() => setShowPostMenu(false)}
          />
        )}
          <CommentSection
            comments={post.comments}
            postAuthorId={post.author._id}
            currentUserId={user._id}
            onDeleteComment={handleDeleteComment}
          />

          <p className="border-t border-gray-200 w-full -mt-3"></p>

          <PostActions post={post} onCommentClick={()=> commentInputRed.current?.focusInput()}/>
          <CommentInput
            ref={commentInputRed}
            postId={post._id}
            onCommentAdded={(updatedPost) => setPost(updatedPost)} 
          />
        </div>
      </div>
    </div>,
    document.getElementById('modal-root')
  )
  }

export default PostView
