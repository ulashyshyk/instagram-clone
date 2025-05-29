import React, { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import { Link } from "react-router-dom";
import profile_pic from "../assets/profile_pic.jpg";
import MessageInput from "./MessageInput";
import { MoveLeft } from "lucide-react";

const ChatBox = ({ selectedUser, goBack }) => {
  const { user } = useAuth();
  const { messages, loadMessagesForUser } = useChat();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (selectedUser?._id) {
      loadMessagesForUser(selectedUser.username);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const chatMessages = messages.filter(
    (msg) =>
      (msg.senderUsername === user.username &&
        msg.receiverUsername === selectedUser.username) ||
      (msg.senderUsername === selectedUser.username &&
        msg.receiverUsername === user.username)
  );

  return (
    <div className="flex  flex-col sm:h-screen w-full sm:flex-1 bg-white">
      <div className="flex flex-row items-center border-b-2  ">
        <button  className="ml-5 hover:text-gray-500 active:text-gray-200" onClick={goBack}>
          <MoveLeft />
        </button>
        <Link
          to={`/profile/${selectedUser.username}`}
          className="sticky  top-0 z-10 bg-white p-4 flex items-center"
        >
          <img
            className="w-[50px] h-[50px] rounded-full object-cover mr-2"
            src={selectedUser.profilePic || profile_pic}
            alt="profile"
          />
          <p className="text-[16px] font-bold">{selectedUser.username}</p>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {chatMessages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[60%] sm:max-w-[40%] px-4 py-2 rounded-xl text-sm ${
              msg.senderUsername === user.username
                ? "ml-auto bg-[#3797F0] hover:bg-blue-400 text-white"
                : "bg-[#EFEFEF] hover:bg-gray-200 text-black"
            }`}
          >
            {msg.message}
          </div>
        ))}
        <div ref={scrollRef}></div>
      </div>

      <MessageInput selectedUser={selectedUser} />
    </div>
  );
};

export default ChatBox;
