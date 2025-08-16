import React, { useEffect, useRef, useState } from "react";
import profile_pic from "../assets/profile_pic.jpg";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { motion } from "framer-motion";
import { HiDotsHorizontal } from "react-icons/hi";
import DeleteModal from "./DeleteModal";
import { Link } from "react-router-dom";

dayjs.extend(relativeTime);

const CommentSection = ({
  comments = [],
  currentUserId,
  postAuthorId,
  onDeleteComment,
}) => {
  const endRef = useRef();
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isOwner = currentUserId === postAuthorId;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  return (
    <div className="h-full px-4 pt-4 space-y-4">
      {comments.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <p className="text-[24px] font-bold text-black dark:text-white">No comments yet.</p>
          <p className="text-[14px] text-black dark:text-white">Start the conversation.</p>
        </div>
      ) : (
        <div className="p-1 flex flex-col gap-5">
          {comments.map((comment) => (
            <motion.div
              key={comment._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-2 group relative"
            >
              {comment.user._id !== currentUserId ? (
                <>
                  <Link to={`/profile/${comment.user.username}`}>
                    <img
                      className="h-[32px] w-[32px] rounded-full object-cover"
                      src={comment.user.profilePic || profile_pic}
                      alt={comment.user.username}
                    />
                  </Link>
                  <div className="flex flex-col w-full">
                    <div className="flex flex-row gap-2 items-center">
                      <Link to={`/profile/${comment.user.username}`}>
                        <p className="text-sm font-semibold text-black dark:text-white">
                          {comment.user.username}
                        </p>
                      </Link>
                      <p className="text-[14px] break-words text-black dark:text-white">{comment.text}</p>
                    </div>
                    <p className="text-[12px] text-gray-400 dark:text-gray-500">
                      {dayjs(comment.createdAt).fromNow()}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <img
                    className="h-[32px] w-[32px] rounded-full object-cover"
                    src={comment.user.profilePic || profile_pic}
                    alt={comment.user.username}
                  />
                  <div className="flex flex-col w-full">
                    <div className="flex flex-row gap-2 items-center">
                      <p className="text-sm font-semibold text-black dark:text-white">
                        {comment.user.username}
                      </p>
                      <p className="text-[14px] break-words text-black dark:text-white">{comment.text}</p>
                    </div>
                    <p className="text-[12px] text-gray-400 dark:text-gray-500">
                      {dayjs(comment.createdAt).fromNow()}
                    </p>
                  </div>
                </>
              )}

              {isOwner && (
                <div className="absolute top-0 right-0 p-1">
                  <div className="hidden group-hover:block">
                    <button
                      onClick={() => setSelectedCommentId(comment._id)}
                      className="text-gray-500 dark:text-gray-400"
                    >
                      <HiDotsHorizontal size={18} />
                    </button>

                    {isModalOpen && selectedCommentId === comment._id && (
                      <DeleteModal
                        setIsModalOpen={setIsModalOpen}
                        onDeleteComment={onDeleteComment}
                        commentId={comment._id}
                      />
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {selectedCommentId && (
            <DeleteModal
              commentId={selectedCommentId}
              onConfirmDelete={() => {
                onDeleteComment(selectedCommentId);
                setSelectedCommentId(null);
              }}
              onCancel={() => setSelectedCommentId(null)}
            />
          )}
          <div ref={endRef} />
        </div>
      )}
    </div>
  );
};

export default CommentSection;
