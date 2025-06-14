import User from '../models/user.model.js'
import Message from '../models/Message.js'

export const messageSocketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id)

    socket.on("join", async (username) => {
      const user = await User.findOne({ username })
      if (user) {
        socket.join(user._id.toString())
        console.log("Joined room:", user._id.toString())
      }
    })

    socket.on("sendMessage", async ({ senderUsername, receiverUsername, message }) => {
      const sender = await User.findOne({ username: senderUsername })
      const receiver = await User.findOne({ username: receiverUsername })

      if (!sender || !receiver) return

      const newMessage = new Message({
        sender: sender._id,
        receiver: receiver._id,
        text: message,
        isRead: false
      })

      await newMessage.save()

      io.to(receiver._id.toString()).emit("receiveMessage", {
        senderUsername,
        receiverUsername,
        message,
        createdAt: newMessage.createdAt
      })

      io.to(receiver._id.toString()).emit("notify", {
        _id: newMessage._id,
        sender: {
          _id: sender._id,
          username: sender.username,
          profilePic: sender.profilePic
        },
        type: "message",
        createdAt: new Date(),
        isRead: false
      });

      console.log(`Message sent from ${senderUsername} ---> ${receiverUsername}`)
    })
  })
}
