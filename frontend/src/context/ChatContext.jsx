import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useAuth } from "./AuthContext";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [messagesByUser, setMessagesByUser] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [allChats, setAllChats] = useState([]);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const socket = useRef(null);
  const selectedUserRef = useRef(null);

  const fetchUnreadChatCount = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`http://localhost:5001/api/chat/unread-count/${user.username}`, config);
      setUnreadChatCount(response.data.count);
    } catch (error) {
      console.error("Failed to fetch unread chat count");
    }
  };

  const markMessagesAsRead = async (senderUsername, receiverUsername) => {

    setAllChats(prev=>
      prev.map(user => 
        user.username === senderUsername ? {...user,hasUnread:false} : user
      )
    )
    try {
      const token = localStorage.getItem("accessToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.patch(
        `http://localhost:5001/api/chat/mark-read/${senderUsername}/${receiverUsername}`,
        {},
        config
      );
      console.log("✅ Marked as read:", response.data);
      await fetchUnreadChatCount();
    } catch (error) {
      console.error("❌ Error in markMessagesAsRead:", error?.response?.data || error.message);
    }
  };

  // Keep a live ref of selectedUser for socket callbacks
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);
  

  const loadAllChats = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`http://localhost:5001/api/chat/chats/${user.username}`, config);
      setAllChats(response.data);
    } catch (error) {
      console.error("Failed to load recent chats", error);
    }
  };

  const updateAllChatsAfterMessage = () => {
    loadAllChats();
  };

  useEffect(() => {
    if (!user) return;

    socket.current = io("http://localhost:5001");

    socket.current.on("connect", () => {
      console.log("✅ Socket connected:", socket.current.id);
    });

    socket.current.emit("join", user.username);
    console.log("👋 Sent join for:", user.username);

    socket.current.on("receiveMessage", (msg) => {
      console.log("💬 Message received:", msg);
      const partner = msg.senderUsername === user.username
        ? msg.receiverUsername
        : msg.senderUsername;
      setMessagesByUser((prev) => ({
        ...prev,
        [partner]: [...(prev[partner] || []), msg],
      }));
      updateAllChatsAfterMessage();
      fetchUnreadChatCount();

      // If chat with the sender is open, mark their messages as read
      if (selectedUserRef.current?.username === msg.senderUsername) {
        markMessagesAsRead(msg.senderUsername, user.username);
      }
    });

    fetchUnreadChatCount();

    return () => socket.current.disconnect();
  }, [user]);

  const sendMessage = ({ receiverUsername, message }) => {
    if (!socket.current || !user) return;

    socket.current.emit("sendMessage", {
      senderUsername: user.username,
      receiverUsername,
      message,
    });

    const localMsg = {
      senderUsername: user.username,
      receiverUsername,
      message,
      temp: true,
      createdAt: new Date().toISOString(),
    };
    setMessagesByUser((prev) => ({
      ...prev,
      [receiverUsername]: [...(prev[receiverUsername] || []), localMsg],
    }));
    updateAllChatsAfterMessage();
    fetchUnreadChatCount();
  };

  const loadMessagesForUser = async (targetUsername) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const response = await axios.get(
        `http://localhost:5001/api/messages/${user.username}/${targetUsername}`,
        config
      );

      setMessagesByUser((prev) => ({
        ...prev,
        [targetUsername]: response.data,
      }));

      await fetchUnreadChatCount()

    } catch (error) {
      console.error("❌ Failed to load chat history", error);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      loadMessagesForUser(selectedUser.username);
      if (user) {
        markMessagesAsRead(selectedUser.username, user.username);
      }
    }
  }, [selectedUser, user]);

  const messages = selectedUser?.username
    ? messagesByUser[selectedUser.username] || []
    : [];

  useEffect(() =>{
    console.log("👀 selectedUser changed to:", selectedUser);
  },[selectedUser])
  return (
    <ChatContext.Provider
      value={{
        socket: socket.current,
        messages,
        messagesByUser,
        sendMessage,
        loadMessagesForUser,
        selectedUser,
        setSelectedUser,
        allChats,
        loadAllChats,
        unreadChatCount,
        fetchUnreadChatCount,
        markMessagesAsRead
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
