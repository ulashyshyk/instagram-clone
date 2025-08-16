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
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const toast = useToast()
  const touchStartXRef = useRef(null)
  const touchEndXRef = useRef(null)

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.changedTouches?.[0]?.clientX ?? null
    touchEndXRef.current = null
    setIsDragging(true)
  }

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.changedTouches?.[0]?.clientX ?? null
    if (touchStartXRef.current != null && touchEndXRef.current != null) {
      setDragOffset(touchEndXRef.current - touchStartXRef.current)
    }
  }

  const handleTouchEnd = () => {
    if (touchStartXRef.current == null || touchEndXRef.current == null) return
    const deltaX = touchStartXRef.current - touchEndXRef.current
    const threshold = 50
    if (deltaX > threshold && mediaIndex < (post.media?.length ?? 0) - 1) {
      setMediaIndex(prev => prev + 1)
    } else if (deltaX < -threshold && mediaIndex > 0) {
      setMediaIndex(prev => prev - 1)
    }
    setIsDragging(false)
    setDragOffset(0)
    touchStartXRef.current = null
    touchEndXRef.current = null
  }
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
    <div className="fixed inset-0 z-[10001] bg-black bg-opacity-70 flex items-center justify-center overflow-y-hidden overscroll-none">
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-3 right-3 z-20 text-white  bg-opacity-50 px-2 py-1  hover:bg-opacity-70 transition"
      >
        ✕
      </button>
      <div className="bg-white shadow-lg flex flex-col md:flex-row w-full h-full md:w-[1100px] md:h-[630px] overflow-hidden relative md:rounded-lg">
        <div
          className='relative w-full md:w-[60%] h-[60vh] md:h-full'
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className='w-full h-full overflow-hidden'>
            <div
              className={`flex w-full h-full ${isDragging ? '' : 'transition-transform duration-300'}`}
              style={{ transform: `translateX(calc(-${mediaIndex * 100}% + ${dragOffset}px))` }}
            >
              {(post.media ?? []).map((mediaItem, idx) => (
                <div key={idx} className='w-full h-full flex-none'>
                  {mediaItem?.type === 'video' ? (
                    <video src={mediaItem?.url} controls playsInline className='w-full h-full object-cover' />
                  ) : (
                    <img src={mediaItem?.url} className='w-full h-full object-cover' alt="Post media" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {mediaIndex > 0 && (
            <button
              onClick={() => setMediaIndex(prev => prev -1)}
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full"
            >
            ←
            </button>
          )}

          {post.media?.length > 0 && mediaIndex < post.media.length - 1 && (
            <button
              onClick={() => setMediaIndex(prev => prev + 1)}
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full"
            >→</button>
          )}
        </div>


        <div className="w-full md:w-[40%] h-[50vh] sm:h-[40vh] md:h-full flex flex-col bg-white dark:bg-black min-h-0">
          <div className='flex flex-row p-4 items-center justify-between'>
            <div className='flex flex-row mb-2 items-center gap-3'>
              <img className='w-[40px] h-[40px] rounded-full object-cover cursor-pointer'  src={user.profilePic || profile_pic}/>
              <p className='pb-3 cursor-pointer hover:text-gray-500 dark:text-white dark:hover:text-gray-400'>{user.username}</p>
              {editing && (
              <div className="px-4 py-2">
                <textarea
                  className="w-full border rounded p-2 text-sm bg-white dark:bg-gray-800 text-black dark:text-white border-gray-200 dark:border-gray-600"
                  value={descDraft}
                  onChange={(e) => setDescDraft(e.target.value)}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleEditPost}
                    className="text-blue-500 dark:text-blue-400 font-semibold"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="text-gray-500 dark:text-gray-400 ml-5 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            </div>     
            <button onClick={() => setShowPostMenu(true)} className='pb-3 text-xl hover:text-gray-500 dark:text-white dark:hover:text-gray-400'><HiDotsHorizontal /></button>
          </div>
          <p className="border-t border-gray-200 dark:border-gray-800 w-full -mt-3"></p>

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
          <div className="flex-1 overflow-y-auto px-2 sm:px-4">
            <CommentSection
              comments={post.comments}
              postAuthorId={post.author._id}
              currentUserId={user._id}
              onDeleteComment={handleDeleteComment}
            />
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 w-full"></div>

          <div className="p-2 sm:p-4 mt-auto">
            <PostActions post={post} onCommentClick={()=> commentInputRed.current?.focusInput()}/>
            <CommentInput
              ref={commentInputRed}
              postId={post._id}
              onCommentAdded={(updatedPost) => setPost(updatedPost)} 
            />
          </div>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root')
  )
  }

export default PostView
