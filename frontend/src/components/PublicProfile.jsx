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
    <div className="mt-10 md:w-[400px] lg:w-[700px] md:p-2 select-none">
      <div className="flex flex-row gap-2 md:gap-5">
        <img
          className="w-[100px] h-[100px] md:w-[150px] md:h-[150px] rounded-full bg-black text-center flex items-center justify-center md:mr-2 object-cover cursor-pointer"
          src={user.profilePic || profile_pic}
          alt="Profile"
        />
        <div className="w-full md:w-[65%]">
          <div className="flex flex-row flex-wrap mt-3 gap-1 md:gap-10 md:ml-6 items-center">
            <p className="md:text-xl cursor-pointer font-medium">
              {user.username}
            </p>
            <div className="flex gap-2 md:gap-3 flex-wrap">
              <button
                onClick={onFollowToggle}
                disabled={followLoading}
                className={`px-3 h-9 md:h-auto md:px-4 md:py-2 font-medium text-xs md:text-sm rounded-xl w-24 md:w-auto whitespace-nowrap text-center flex items-center justify-center ${
                  user.isFollowing
                    ? "bg-[#EFEFEF] text-black hover:bg-gray-300"
                    : "bg-[#0095F6] text-white hover:bg-blue-400"
                }`}
              >
                {followLoading ? (
                  <Spinner size="sm" />
                ) : user.isFollowing ? (
                  "Unfollow"
                ) : (
                  "Follow"
                )}
              </button>

              <button onClick={handleMessageClick} className="px-3 py-1.5 md:px-4 md:py-2 font-medium bg-[#EFEFEF] text-xs md:text-sm rounded-xl hover:bg-gray-200 whitespace-nowrap">
                Message
              </button>
            </div>
          </div>
          <div className="flex flex-row text-[13px] md:text-[16px] gap-3 md:gap-6 py-2">
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
          <div className="py-2 text-[13px] md:text-[15px]">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-sm cursor-pointer">{user.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
