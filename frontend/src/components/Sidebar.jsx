import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { BiHomeAlt2 } from "react-icons/bi";
import { IoIosSearch } from "react-icons/io";
import { MessageCircle } from "lucide-react";
import { FaRegHeart } from "react-icons/fa";
import { FiPlusSquare } from "react-icons/fi";
import { FaInstagram } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import Modal from "./Modal";
import { useAuth } from "../context/AuthContext";
import profile_pic from "../assets/profile_pic.jpg";
import PostModal from "./PostModal";
import SearchModal from "./SearchModal";
import NotificationModal from "./NotificationModal";
import { useNotification } from "../context/NotificationContext";
import { useChat } from "../context/ChatContext";

const Sidebar = () => {
  const [activeModal, setActiveModal] = useState(null);
  const { user } = useAuth();
  const { unreadCount } = useNotification();
  const { unreadChatCount,fetchUnreadChatCount } = useChat();

  useEffect(() => {
    fetchUnreadChatCount()
  },[fetchUnreadChatCount()])
  return (
    <div className="flex gap-0 flex-row md:flex-col md:w-[250px]  p-4 md:p-7 md:h-[100vh] border-t-2 md:border-r-2 border-gray-100 fixed bottom-0 w-full justify-between items-center md:items-start md:gap-6 md:fixed md:left-0 md:top-0  bg-white shadow md:shadow-none z-50">
      <div>
        <Link to="/" className="font-jaini text-3xl hidden md:block">
          Ulashgram
        </Link>
        <Link to="/">
          <FaInstagram className="block md:hidden text-2xl mx-auto" />
        </Link>
      </div>

      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive
            ? "flex flex-row md:w-full items-center gap-2 bg-gray-200 p-1 rounded-lg "
            : "flex flex-row md:w-full items-center hover:bg-gray-200 hover:rounded-lg gap-2 font-normal p-1"
        }
      >
        <BiHomeAlt2 className="text-3xl" />
        <span className="hidden md:inline">Home</span>
      </NavLink>

      <button
        onClick={() => setActiveModal("search")}
        className={`flex flex-row items-center gap-2 p-1 rounded-lg font-normal ${
          activeModal === "search"
            ? "md:w-full bg-gray-200"
            : "md:w-full hover:bg-gray-200 hover:rounded-lg"
        }`}
      >
        <IoIosSearch className="text-3xl" />
        <span className="hidden md:inline">Search</span>
      </button>

      {activeModal === "search" && (
        <SearchModal isOpen={true} onClose={() => setActiveModal(null)} />
      )}
      <div className="relative">
        <NavLink
          to="/messages"
          className={({ isActive }) =>
            isActive
              ? "md:w-full flex flex-row items-center gap-2 bg-gray-200 p-1 rounded-lg "
              : "md:w-full flex flex-row items-center gap-2 hover:bg-gray-200 hover:rounded-lg font-normal p-1"
          }
        >
          <MessageCircle />
          {unreadChatCount > 0 && (
            <span className="absolute top-1 left-2 transform translate-x-2 -translate-y-1 text-[10px] bg-red-500 text-white rounded-full px-[6px] py-[1px] font-bold">
              {unreadChatCount}
            </span>
          )}
          <span className="hidden md:inline">Messages</span>
        </NavLink>        
      </div>


      <div className="relative">
        <button
          onClick={() => setActiveModal("notification")}
          className={`w-full flex flex-row items-center gap-2 p-1 rounded-lg font-normal ${
            activeModal === "notification"
              ? "md:w-full bg-gray-200"
              : "md:w-full hover:bg-gray-200 hover:rounded-lg"
          }`}
        >
          <FaRegHeart className="text-2xl" />
          {unreadCount > 0 && (
            <span className="absolute top-1 left-2 transform translate-x-2 -translate-y-1 text-[10px] bg-red-500 text-white rounded-full px-[6px] py-[1px] font-bold">
              {unreadCount}
            </span>
          )}
          <span className="hidden md:inline">Notifications</span>
        </button>
      </div>

      {activeModal === "notification" && (
        <NotificationModal isOpen={true} onClose={() => setActiveModal(null)} />
      )}

      <button
        onClick={() => setActiveModal("post")}
        className="flex flex-row items-center gap-2 hover:bg-gray-200 active:bg-gray-200 p-1 rounded-lg"
      >
        <FiPlusSquare className="text-2xl" />
        <span className="hidden md:inline">Create</span>
      </button>

      {activeModal === "post" && (
        <PostModal setPostModalOpen={() => setActiveModal(null)} />
      )}

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          isActive
            ? "md:w-full flex flex-row items-center gap-2 bg-gray-200 md:p-1 rounded-lg "
            : "md:w-full flex flex-row items-center hover:bg-gray-200 hover:rounded-lg gap-2 font-normal md:p-1"
        }
      >
        <img
          className="w-[30px] h-[30px] rounded-full object-cover"
          src={user.profilePic || profile_pic}
          alt="Profile"
        />
        <span className="hidden md:inline">Profile</span>
      </NavLink>

      <button
        onClick={() => setActiveModal("menu")}
        className="flex flex-row mt-auto items-center gap-2 font-normal p-1"
      >
        <IoMenu className="text-2xl" />
        <span className="hidden md:inline">More</span>
      </button>

      {activeModal === "menu" && (
        <Modal setIsModalOpen={() => setActiveModal(null)} />
      )}
    </div>
  );
};

export default Sidebar;
