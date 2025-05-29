import React from "react";
import profile_pic from "../assets/profile_pic.jpg";
import { Dot } from "lucide-react";
const ChatListItem = ({ user, onClick }) => {
  const unread = user.hasUnread;
  return (
    <div onClick={onClick} className={`cursor-pointer w-full flex flex-row items-center px-3 py-2 hover:rounded-md hover:bg-gray-100`}>
      <img
        className="w-[50px] h-[50px] rounded-full object-cover mr-1"
        src={user.profilePic || profile_pic}
        alt="profile"
      />
      <div className="flex flex-col ml-2">
        <p className="text-[16px] font-medium">{user.username}</p>
      </div>
      {unread && (
        <div className="ml-auto">
          <Dot size={50} className="text-blue-500"/>
        </div>
      )}
    </div>
  );
};

export default ChatListItem;
