import React, { useRef, useState, useMemo } from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import profile_pic from "../assets/profile_pic.jpg";
import PostActions from "./PostActions";
import PublicPostView from "./PublicPostView";
import { MdCollections, MdPlayCircleFilled } from "react-icons/md"; 

const FeedPostCard = ({ post }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formatTimeAgo = (dateString) => {
    const now = dayjs();
    const created = dayjs(dateString);
    const mins = now.diff(created, "minute");
    if (mins === 0) {
      return "few seconds ago";
    }
    if (mins < 60) return `${mins}m`;

    const hours = now.diff(created, "hour");
    if (hours < 24) return `${hours}h`;

    const days = now.diff(created, "day");
    if (days < 7) return `${days}d`;

    const weeks = now.diff(created, "week");
    return `${weeks}w`;
  };

  const [previewIndex, setPreviewIndex] = useState(0)
  const touchStartXRef = useRef(null)
  const touchEndXRef = useRef(null)
  const wasSwipingRef = useRef(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const currentMedia = post.media?.[previewIndex]

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

  const handleCardClick = () => {
    if (wasSwipingRef.current) {
      wasSwipingRef.current = false
      return
    }
    setIsModalOpen(true)
  }

  return (
    <div className="flex flex-col w-[335px] h-[550px] md:w-[450px] md:h-[650px]">
      <Link
        to={`/profile/${post.author.username}`}
        className="flex flex-row items-center gap-1"
      >
        <img
          className="object-cover rounded-full w-[42px] h-[42px] mr-1"
          src={post.author.profilePic || profile_pic}
        />
        <p className="text-[14px] font-medium text-black dark:text-white">{post.author.username}</p>
        <p className="text-[#737373] dark:text-gray-400">•</p>
        <p className="text-[#737373] dark:text-gray-400 text-[14px]">
          {formatTimeAgo(post.createdAt)}
        </p>
      </Link>
      <div
        className="relative mt-2 h-[80%] shadow-xl cursor-pointer"
        onClick={handleCardClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-full h-full overflow-hidden rounded-md">
          <div
            className={`${isDragging ? '' : 'transition-transform duration-300'} flex w-full h-full`}
            style={{ transform: `translateX(calc(-${previewIndex * 100}% + ${dragOffset}px))` }}
          >
            {(post.media ?? []).map((m, idx) => (
              <div key={idx} className="w-full h-full flex-none">
                {m?.type === "video" ? (
                  <video
                    src={m.url}
                    className="w-full h-full object-cover rounded-md"
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    className="w-full h-full object-cover rounded-md"
                    src={m?.url}
                    alt="Post"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {post.media?.length > 1 && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full">
            <MdCollections size={18} />
          </div>
        )}

        {post.media?.length === 1 && post.media[0].type === "video" && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full">
            <MdPlayCircleFilled size={18} />
          </div>
        )}
      </div>

      <div className=" w-1/2 ml-[-8px] mb-[-14px]">
        <PostActions
          onCommentClick={() => setIsModalOpen(true)}
          post={post}
          type={"feed"}
        />
      </div>
      {post.description && (
        <div className="text-black dark:text-white">
          <Link
            className="text-[14px] pl-[8px]  font-medium mr-2 text-black dark:text-white"
            to={`/profile/${post.author.username}`}
          >
            {post.author.username}
          </Link>
          {post.description}
        </div>
      )}
      {isModalOpen && (
        <PublicPostView
          type={"feed"}
          post={post}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default FeedPostCard;
