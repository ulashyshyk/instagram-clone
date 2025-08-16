import React, { useRef, useState } from 'react'
import PublicPostView from './PublicPostView'
import { MdCollections, MdPlayCircleFilled } from "react-icons/md"

const PublicPostCard = ({ post }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const hasMultipleMedia = Array.isArray(post.media) && post.media.length > 1
  const isSingleVideo = post.media?.length === 1 && post.media[0].type === 'video'
  const [previewIndex, setPreviewIndex] = useState(0)
  const touchStartXRef = useRef(null)
  const touchEndXRef = useRef(null)
  const wasSwipingRef = useRef(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const previewMedia = post.media?.[previewIndex] ?? null

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.changedTouches?.[0]?.clientX ?? null
    touchEndXRef.current = null
    wasSwipingRef.current = false
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
    const threshold = 40
    if (post.media?.length > 1 && Math.abs(deltaX) > threshold) {
      wasSwipingRef.current = true
      if (deltaX > 0 && previewIndex < post.media.length - 1) {
        setPreviewIndex(prev => prev + 1)
      } else if (deltaX < 0 && previewIndex > 0) {
        setPreviewIndex(prev => prev - 1)
      }
    }
    setIsDragging(false)
    setDragOffset(0)
    touchStartXRef.current = null
    touchEndXRef.current = null
  }

  return (
    <>
      {isModalOpen && (
        <PublicPostView
          setIsModalOpen={setIsModalOpen}
          post={post}
        />
      )}

      <div
        onClick={() => {
          if (wasSwipingRef.current) {
            wasSwipingRef.current = false
            return
          }
          setIsModalOpen(true)
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full max-w-[160px] aspect-[3/4] sm:max-w-[200px] bg-white shadow-sm hover:bg-gray-100 overflow-hidden cursor-pointer relative group"
      >
        <div className="w-full h-full overflow-hidden">
          <div
            className={`${isDragging ? '' : 'transition-transform duration-300'} flex w-full h-full`}
            style={{ transform: `translateX(calc(-${previewIndex * 100}% + ${dragOffset}px))` }}
          >
            {(post.media ?? []).map((m, idx) => (
              <div key={idx} className="w-full h-full flex-none">
                {m?.type === 'video' ? (
                  <video
                    src={m.url}
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
                    src={m?.url}
                    alt="post"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

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

export default PublicPostCard
