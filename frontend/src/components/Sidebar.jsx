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

const Sidebar = ({ compact = false }) => {
  const [activeModal, setActiveModal] = useState(null);
  const { user } = useAuth();
  const { unreadCount } = useNotification();
  const { unreadChatCount,fetchUnreadChatCount } = useChat();

  useEffect(() => {
    fetchUnreadChatCount();
  }, [fetchUnreadChatCount])

  const itemBase = `relative flex flex-row md:w-full items-center ${compact ? "md:justify-center" : ""} gap-2 p-2 rounded-lg transition-colors`;
  const itemHover = "hover:bg-gray-200";
  const itemActive = "bg-gray-200";
  const labelClass = compact ? "hidden" : "hidden md:inline";
  const containerWidth = compact ? "md:w-[80px] md:p-4" : "md:w-[250px] md:p-7";
  return (
    <div className={`flex gap-0 flex-row md:flex-col ${containerWidth} p-4 md:h-[100vh] border-t-2 md:border-r-2 border-gray-100 fixed bottom-0 w-full justify-between items-center ${compact ? "md:items-center" : "md:items-start"} md:gap-6 md:fixed md:left-0 md:top-0  bg-white shadow md:shadow-none z-50`}>
      <div>
        <Link to="/" className={`font-jaini text-3xl ${compact ? "hidden" : "hidden md:block"}`}>
          Ulashgram
        </Link>
        <Link to="/">
          <FaInstagram className="block md:hidden text-2xl mx-auto" />
        </Link>
      </div>

      <NavLink
        to="/"
        className={({ isActive }) => `${itemBase} ${isActive ? itemActive : itemHover}`}
      >
        <BiHomeAlt2 className="text-3xl" />
        <span className={labelClass}>Home</span>
      </NavLink>

      <button
        onClick={() => setActiveModal((prev) => (prev === "search" ? null : "search"))}
        className={`${itemBase} ${activeModal === "search" ? itemActive : itemHover}`}
      >
        <IoIosSearch className="text-3xl" />
        <span className={labelClass}>Search</span>
      </button>

      {activeModal === "search" && (
        <SearchModal isOpen={true} onClose={() => setActiveModal(null)} isSidebarCompact={compact} />
      )}

      <NavLink
        to="/messages"
        className={({ isActive }) => `${itemBase} ${isActive ? itemActive : itemHover}`}
      >
        <MessageCircle />
        {unreadChatCount > 0 && (
          <span className="absolute top-1 left-2 transform translate-x-2 -translate-y-1 text-[10px] bg-red-500 text-white rounded-full px-[6px] py-[1px] font-bold">
            {unreadChatCount}
          </span>
        )}
        <span className={labelClass}>Messages</span>
      </NavLink>


      <button
        onClick={() => setActiveModal((prev) => (prev === "notification" ? null : "notification"))}
        className={`${itemBase} ${activeModal === "notification" ? itemActive : itemHover}`}
      >
        <FaRegHeart className="text-2xl" />
        {unreadCount > 0 && (
          <span className="absolute top-1 left-2 transform translate-x-2 -translate-y-1 text-[10px] bg-red-500 text-white rounded-full px-[6px] py-[1px] font-bold">
            {unreadCount}
          </span>
        )}
        <span className={labelClass}>Notifications</span>
      </button>

      {activeModal === "notification" && (
        <NotificationModal isOpen={true} onClose={() => setActiveModal(null)} isSidebarCompact={compact} />
      )}

      <button
        onClick={() => setActiveModal("post")}
        className={`flex flex-row md:w-full items-center ${compact ? "md:justify-center" : ""} gap-2 bg-indigo-600 text-white hover:bg-indigo-600/90 active:scale-[.99] p-2 rounded-lg`}
      >
        <FiPlusSquare className="text-2xl" />
        <span className={labelClass}>Create</span>
      </button>

      {activeModal === "post" && (
        <PostModal setPostModalOpen={() => setActiveModal(null)} />
      )}

      <NavLink
        to="/profile"
        className={({ isActive }) => `${itemBase} ${isActive ? itemActive : itemHover}`}
      >
        <img
          className="w-[30px] h-[30px] rounded-full object-cover"
          src={user.profilePic || profile_pic}
          alt="Profile"
        />
        <span className={labelClass}>Profile</span>
      </NavLink>

      <button
        onClick={() => setActiveModal("menu")}
        className={`flex flex-row mt-auto md:w-full items-center ${compact ? "md:justify-center" : ""} gap-2 p-2 rounded-lg hover:bg-gray-200`}
      >
        <IoMenu className="text-2xl" />
        <span className={labelClass}>More</span>
      </button>

      {activeModal === "menu" && (
        <Modal setIsModalOpen={() => setActiveModal(null)} />
      )}
    </div>
  );
};

export default Sidebar;
