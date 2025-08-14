import React, { useEffect, useState, useRef } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import CommentSection from './CommentSection'
import CommentInput from './CommentInput'
import PostActions from './PostActions'
import profile_pic from '../assets/profile_pic.jpg'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const PublicPostView = ({ setIsModalOpen, post: initialPost, type }) => {
  const [post, setPost] = useState(initialPost)
  const [mediaIndex, setMediaIndex] = useState(0)
  const commentInputRef = useRef()
  const { user } = useAuth()

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
    if (!initialPost?._id) return

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
  }, [initialPost?._id])

  if (!post?._id || !post.likes || !user?._id) return null

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[10001] bg-black bg-opacity-70 flex items-center justify-center overflow-y-hidden overscroll-none">
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-3 right-3 z-20 text-white bg-opacity-50 px-2 py-1 hover:bg-opacity-70 transition"
      >
        ✕
      </button>

      <div className="bg-white shadow-2xl flex flex-col md:flex-row w-full h-full md:w-[1100px] md:h-[630px] overflow-hidden relative md:rounded-lg">
        <div className="relative w-full md:w-[60%] h-[60vh] md:h-full">
          {post.media?.[mediaIndex]?.type === 'video' ? (
            <video
              src={post.media?.[mediaIndex]?.url}
              className="w-full h-full object-cover"
              controls
              playsInline
              autoPlay
              loop
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={post.media?.[mediaIndex]?.url}
              className="w-full h-full object-cover"
              alt="Post"
            />
          )}

          {mediaIndex > 0 && (
            <button
              onClick={() => setMediaIndex(prev => prev - 1)}
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full"
            >
              ←
            </button>
          )}

          {post.media?.length > 0 && mediaIndex < post.media.length - 1 && (
            <button
              onClick={() => setMediaIndex(prev => prev + 1)}
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full"
            >
              →
            </button>
          )}
        </div>

        <div className="w-full md:w-[40%] h-[50vh] sm:h-[40vh] md:h-full flex flex-col bg-white min-h-0">
          {type === 'feed' ? (
            <Link to={`/profile/${post.author?.username}`} className="flex flex-row p-4 items-center gap-3">
              <img
                className="w-[40px] h-[40px] rounded-full object-cover cursor-pointer"
                src={post.author?.profilePic || profile_pic}
                alt="author"
              />
              <p className="font-medium cursor-pointer hover:text-gray-500">{post.author?.username}</p>
            </Link>
          ) : (
            <div className="flex flex-row p-4 items-center gap-3">
              <img
                className="w-[40px] h-[40px] rounded-full object-cover cursor-pointer"
                src={post.author?.profilePic || profile_pic}
                alt="author"
              />
              <p className="font-medium cursor-pointer hover:text-gray-500">{post.author?.username}</p>
            </div>
          )}

          <p className="border-t border-gray-200 w-full"></p>

          <div className="flex-1 overflow-y-auto px-2 sm:px-4">
            <CommentSection
              comments={post.comments || []}
              postAuthorId={post.author?._id}
              currentUserId={user._id}
              onDeleteComment={() => {}}
            />
          </div>

          <div className="p-2 sm:p-4 mt-auto">
            <PostActions
              post={post}
              onCommentClick={() => commentInputRef.current?.focusInput()}
            />

            <CommentInput
              ref={commentInputRef}
              postId={post._id}
              onCommentAdded={(updatedPost) => {
                setPost(prev => ({
                  ...updatedPost,
                  author: prev.author
                }))
              }}
            />
          </div>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root')
  )
}

export default PublicPostView
