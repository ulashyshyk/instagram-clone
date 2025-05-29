import React, { useEffect } from "react";
import { useChat } from "../context/ChatContext";
import ChatListItem from "./ChatListItem.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const ChatSidebar = () => {
  const { allChats, loadAllChats, selectedUser,markMessagesAsRead, setSelectedUser } = useChat();
  const {user:currentUser} = useAuth()
  
  useEffect(() => {
    loadAllChats();
  }, []);

  return (
    <div className="flex flex-col h-[100vh] w-full  overflow-y-auto border-r-1 shadow-lg">
      <h1 className="text-xl font-bold p-4">Chats</h1>

      {allChats.length === 0 ? (
        <p className="p-4 text-sm text-gray-400">No chats available.</p>
      ) : (
        allChats.map((user) => (
          <ChatListItem
            key={user._id}
            user={user}
            onClick={() => {
              if (selectedUser?._id !== user._id) {
                setSelectedUser(user);
                localStorage.setItem("selectedChatUser", JSON.stringify(user));
                markMessagesAsRead(user.username,currentUser.username)
              }
            }}
          />
        ))
      )}
    </div>
  );
};

export default ChatSidebar;
