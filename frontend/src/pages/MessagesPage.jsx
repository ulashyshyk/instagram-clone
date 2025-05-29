import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatSidebar from "../components/ChatSidebar";
import ChatBox from "../components/ChatBox";
import Spinner from "../components/Spinner";
import { useChat } from "../context/ChatContext";

const MessagesPage = () => {
  const { selectedUser, setSelectedUser, messages, loadMessagesForUser } = useChat();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // const saved = localStorage.getItem("selectedChatUser");

    // const isDesktop = window.innerWidth >= 640;
    // if (saved && isDesktop) {
    //   const user = JSON.parse(saved);
    //   setSelectedUser(user);
    // }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (selectedUser) {
      localStorage.setItem("selectedChatUser", JSON.stringify(selectedUser));
      loadMessagesForUser(selectedUser.username);
    }
  }, [selectedUser]);
  
  if (isLoading) return <Spinner />;

  return (
    <div className="flex pb-[65px] sm:pb-0 w-full h-[100vh] sm:min-h-screen overflow-x-hidden select-none">
      <Sidebar />
      <div className="flex w-full sm:hidden">
        {selectedUser === null ? (
         <ChatSidebar setSelectedUser={setSelectedUser} />
        ) : (
          <ChatBox
            selectedUser={selectedUser}
            goBack={() => setSelectedUser(null)}
          />
        )}
      </div>
  
      <div className="hidden sm:flex w-full md:ml-[249px]">
        <div className="w-[300px]">
          <ChatSidebar setSelectedUser={setSelectedUser} />
        </div>
        <div className="flex-grow ">
          {selectedUser ? (
            <ChatBox 
                selectedUser={selectedUser} 
                goBack={() => setSelectedUser(null)}
            />
          ) : (
            <div className="flex justify-center items-center w-full h-full">
              <p className="font-semibold text-[14px] shadow-sm">
                Send a message to start a chat
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
};

export default MessagesPage;
