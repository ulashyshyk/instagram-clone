import express from "express";
import User from "../models/user.model.js";
import { verifyToken } from "../models/verifyToken.js";
import Message from "../models/Message.js";
const router = express.Router();

router.get("/chats/:username", verifyToken, async (req, res) => {
  const { username } = req.params;

  const currentUser = await User.findOne({ username }).populate(
    "following",
    "username profilePic"
  );
  if (!currentUser) return res.status(404).json({ message: "User not found" });

  // Get all users who sent or received messages with me
  const sentIds = await Message.find({ sender: currentUser._id }).distinct(
    "receiver"
  );
  const receivedIds = await Message.find({
    receiver: currentUser._id,
  }).distinct("sender");
  const messagedIds = [...sentIds, ...receivedIds];

  // Combine message users + followed users
  const combinedIds = new Set([
    ...currentUser.following.map((user) => user._id.toString()),
    ...messagedIds.map((id) => id.toString()),
  ]);

  // Find last message time for each user
  const lastMessages = await Message.aggregate([
    {
      $match: {
        $or: [{ sender: currentUser._id }, { receiver: currentUser._id }],
      },
    },
    {
      $project: {
        userId: {
          $cond: [
            { $eq: ["$sender", currentUser._id] },
            "$receiver",
            "$sender",
          ],
        },
        createdAt: 1,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: "$userId",
        lastMessageAt: { $first: "$createdAt" },
      },
    },
  ]);

  const lastMap = Object.fromEntries(
    lastMessages.map((last) => [last._id.toString(), last.lastMessageAt])
  );

  // Pull full user profiles
  const users = await User.find(
    { _id: { $in: Array.from(combinedIds) } },
    "_id username profilePic"
  );
  const unreadMap = await Message.aggregate([
    {$match:{
      receiver: currentUser._id,
      isRead:false
    },
  },
  {
    $group:{
      _id:"$sender",
      count:{$sum:1},
    }
  }
  ])

  const unreadByUser = Object.fromEntries(
    unreadMap.map(unread => [unread._id.toString(),true])
  )

  const sorted = users
    .map((user) => ({
      ...user.toObject(),
      lastMessageAt: lastMap[user._id.toString()] || null,
      hasUnread: unreadByUser[user._id.toString()] || false,
    }))
    .sort((a, b) => {
      if (a.lastMessageAt && b.lastMessageAt) {
        return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
      } else if (a.lastMessageAt) {
        return -1;
      } else if (b.lastMessageAt) {
        return 1;
      } else {
        return 0;
      }
    });
  res.json(sorted);
});


router.get("/unread-count/:username", verifyToken, async (req, res) => {
  try {
    const { username } = req.params;

    const currentUser = await User.findOne({ username: username });

    if (!currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const unreadChats = await Message.aggregate([
      {
        $match: {
          receiver: currentUser._id,
          isRead: false,
        },
      },
      {
        $group: {
          _id: "$sender",
        },
      },
    ]);

    res.json({count:unreadChats.length})
  } catch (error) {
    console.error("Unread chat count failed:",error)
    res.status(500).json({message:"Server error"})
  }
});

router.patch("/mark-read/:sender/:receiver", verifyToken, async (req, res) => {
  try {
    const { sender, receiver } = req.params;


    const senderUser = await User.findOne({ username: sender });
    const receiverUser = await User.findOne({ username: receiver });

    if (!senderUser || !receiverUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const updateResult = await Message.updateMany(
      {
        sender: senderUser._id,
        receiver: receiverUser._id,
        isRead: false,
      },
      { $set: { isRead: true } }
    );

    res.status(200).json({ message: "Marked as read",updatedCount:updateResult.modifiedCount });
  } catch (error) {
    console.error("Error marking messages as read", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
