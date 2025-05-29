import React, { useState } from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import profile_pic from "../assets/profile_pic.jpg";
import PostActions from "./PostActions";
import PublicPostView from "./PublicPostView";
import { MdCollections, MdPlayCircleFilled } from "react-icons/md"; // make sure this is imported

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
        <p className="text-[14px] font-medium">{post.author.username}</p>
        <p className="text-[#737373]">•</p>
        <p className="text-[#737373] text-[14px]">
          {formatTimeAgo(post.createdAt)}
        </p>
      </Link>

      <div
        className="relative mt-2 h-[80%] shadow-xl cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        {post.media?.[0]?.type === "video" ? (
          <video
            src={post.media[0].url}
            className="w-full h-full object-cover rounded-md"
            muted
            playsInline
          />
        ) : (
          <img
            className="w-full h-full object-cover rounded-md"
            src={post.media?.[0]?.url}
            alt="Post"
          />
        )}

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
        <div>
          <Link
            className="text-[14px] pl-[8px]  font-medium mr-2"
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
