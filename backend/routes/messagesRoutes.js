import express from "express";
import Message from "../models/Message.js";
import User from "../models/user.model.js";

const router = express.Router();

// Get all messages between two users
router.get('/:username1/:username2', async (req, res) => {
  const { username1, username2 } = req.params;

  const user1 = await User.findOne({ username: username1 });
  const user2 = await User.findOne({ username: username2 });

  if (!user1 || !user2) {
    return res.status(404).json({ error: 'User not found' });
  }

  const messages = await Message.find({
    $or: [
      { sender: user1._id, receiver: user2._id },
      { sender: user2._id, receiver: user1._id },
    ]
  })
    .sort({ createdAt: 1 })
    .populate('sender', 'username')
    .populate('receiver', 'username');

  const formatted = messages.map((msg) => ({
    _id: msg._id,
    senderUsername: msg.sender.username,
    receiverUsername: msg.receiver.username,
    message: msg.text,
    createdAt: msg.createdAt,
    isRead: msg.isRead
  }));

  res.json(formatted);
});

export default router;
