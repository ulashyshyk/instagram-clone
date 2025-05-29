import React, { useEffect, useState } from 'react'
import PostView from './PostView'
import { MdCollections, MdPlayCircleFilled } from "react-icons/md"

const PostCard = ({ post, onPostDeleted, autoOpen, setSelectedPostId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (autoOpen) {
      setIsModalOpen(true)
    }
  }, [autoOpen])

  const previewMedia = Array.isArray(post.media) && post.media.length > 0 ? post.media[0] : null
  const hasMultipleMedia = Array.isArray(post.media) && post.media.length > 1
  const isSingleVideo = post.media?.length === 1 && post.media[0].type === 'video'

  return (
    <>
      {isModalOpen && (
        <PostView
          setIsModalOpen={(value) => {
            setIsModalOpen(value)
            if (!value) {
              setSelectedPostId(null)
            }
          }}
          post={post}
          onPostDeleted={onPostDeleted}
        />
      )}

      <div
        onClick={() => setIsModalOpen(true)}
        className="w-full max-w-[160px] aspect-[3/4] sm:max-w-[200px] bg-white shadow-2xl hover:bg-gray-100 overflow-hidden cursor-pointer relative group"
      >
        {previewMedia?.type === 'video' ? (
          <video
            src={previewMedia.url}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            muted
            playsInline
            autoPlay
            loop
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={previewMedia?.url}
            alt="post"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}

        {hasMultipleMedia && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full">
            <MdCollections size={18} />
          </div>
        )}

        {isSingleVideo && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full">
            <MdPlayCircleFilled size={18} />
          </div>
        )}

        <div className="flex items-center justify-center absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-65 transition-all duration-300">
          <div className="absolute flex flex-row bg-black bg-opacity-60 text-white text-sm font-semibold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <p className='mr-4'>🤍 {post.likes.length}</p>
            <p>💬 {post.comments.length}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default PostCard
