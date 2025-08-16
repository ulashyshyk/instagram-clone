import React, { useState } from "react"
import { useChat } from "../context/ChatContext"

const MessageInput = ({ selectedUser }) => {
  const [text, setText] = useState("")
  const { sendMessage } = useChat()

  const handleSend = (e) => {
    e.preventDefault()
    if (!text.trim()) return

    sendMessage({
      receiverUsername: selectedUser.username,
      message: text
    })

    setText("")
  }

  return (
    <form onSubmit={handleSend} className="p-4 md:sticky md:bottom-0 md:z-10 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black flex items-center gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Send
      </button>
    </form>
  )
}

export default MessageInput
