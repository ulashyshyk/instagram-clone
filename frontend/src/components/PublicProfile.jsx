import React, { useState } from "react";
import profile_pic from "../assets/profile_pic.jpg";
import FollowersFollowingModal from "./FollowersFollowingModal";
import Spinner from "./Spinner";
import { useChat } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
const PublicProfile = ({ user, onFollowToggle, followLoading }) => {
  const [isFollowingFollowersModalOpen, setIsFollowingFollowersModalOpen] = useState(false);
  const navigate = useNavigate()
  const { setSelectedUser } = useChat()
  const [modalType, setModalType] = useState(null);

  const handleMessageClick = () => {
    setSelectedUser(user)
    localStorage.setItem('selectedChatUser',JSON.stringify(user))
    navigate('/messages')
  }
  return (
    <div className="mt-10 w-[400px] sm:w-[500px] lg:w-[700px] p-2 select-none">
      <div className="flex flex-row gap-5">
        <img
          className="w-[150px] h-[150px] rounded-full bg-black text-center flex items-center justify-center md:mr-2 object-cover cursor-pointer"
          src={user.profilePic || profile_pic}
          alt="Profile"
        />
        <div className="w-[65%]">
          <div className="flex flex-row mt-3 gap-10 ml-6 items-center">
            <p className="text-xl cursor-pointer font-medium">
              {user.username}
            </p>
            <div className="flex gap-3">
              <button
                onClick={onFollowToggle}
                disabled={followLoading}
                className={`px-4 py-2 font-medium text-sm rounded-xl ${
                  user.isFollowing
                    ? "bg-[#EFEFEF] text-black hover:bg-gray-300"
                    : "bg-[#0095F6] text-white hover:bg-blue-400"
                }`}
              >
                {followLoading ? (
                  <Spinner />
                ) : user.isFollowing ? (
                  "Unfollow"
                ) : (
                  "Follow"
                )}
              </button>

              <button onClick={handleMessageClick} className="px-4 py-2 font-medium bg-[#EFEFEF] text-sm rounded-xl hover:bg-gray-200">
                Message
              </button>
            </div>
          </div>
          <div className="flex flex-row gap-6 py-2">
            <p>
              {user.posts.length}
              <span className="text-gray-500 ml-1.5">posts</span>
            </p>
            <button
              onClick={() => {
                setModalType("followers");
                setIsFollowingFollowersModalOpen(true);
              }}
            >
              {user.followersCount}
              <span className="text-gray-500 ml-1.5">followers</span>
            </button>

            <button
              onClick={() => {
                setModalType("following");
                setIsFollowingFollowersModalOpen(true);
              }}
            >
              {user.followingCount}
              <span className="text-gray-500 ml-1.5">following</span>
            </button>

            <FollowersFollowingModal
              isOpen={isFollowingFollowersModalOpen}
              onClose={() => setIsFollowingFollowersModalOpen(false)}
              type={modalType}
              userId={user._id}
            />
          </div>
          <div className="py-2">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-sm cursor-pointer">{user.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
