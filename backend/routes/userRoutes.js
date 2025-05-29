import express from "express";
import User from "../models/user.model.js";
import { upload } from "../models/profile-picModel.js";
import { verifyToken } from "../models/verifyToken.js";
import Post from "../models/postModel.js";
import Notification from "../models/notificationModel.js";
const router = express.Router();

router.post("/profile-pic",verifyToken,upload.single("profilePic"),async (req, res) => {
    try {
      const userId = req.user.id;
      const profilePicUrl = req.file?.path;

      if (!profilePicUrl) {
        return res.status(400).json({ message: "No file uploaded." });
      }

      // Find the user and update their profile picture URL
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: profilePicUrl },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found." });
      }

      // Send back the updated user info (including the profile picture URL)
      res.status(200).json({
        message: "Profile picture updated successfully!",
        user: updatedUser,
      });
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  }
);

router.post("/delete-profile-pic", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: null },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "Profile picture removed successfully!",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error removing profile picture:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});
router.get("/bio", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ bio: user.bio });
  } catch (error) {
    console.error("Error fetching bio:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/bio", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { bio } = req.body;

  if (bio && bio.length > 150) {
    return res
      .status(400)
      .json({ message: "Bio must be 150 characters or less." });
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { bio: bio },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "Bio updated successfully!",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating bio:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

router.post("/name", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { name } = req.body;

  if (name && name.length > 40) {
    return res
      .status(400)
      .json({ message: "Name should be less than 40 characters" });
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name: name },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "Name updated successfully!",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating name:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

router.get("/name", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ name: user.name });
  } catch (error) {
    console.error("Error fetching name:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/search", verifyToken, async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === "") {
    return res.status(400).json({ message: "Query is required" });
  }

  try {
    const users = await User.find({
      username: new RegExp(query, "i"),
      _id: { $ne: req.user.id },
    })
      .limit(10)
      .select("_id username name profilePic");

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Search failed:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/users/:username", verifyToken, async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentUserId = req.user.id;
    const isFollowing = user.followers.includes(currentUserId);

    const posts = await Post.find({ author: user._id })
      .sort({ createdAt: -1 })
      .select("_id description createdAt media comments likes author");

    res.status(200).json({
      _id: user._id,
      username: user.username,
      name: user.name,
      bio: user.bio,
      profilePic: user.profilePic,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      isFollowing,
      posts,
    });
  } catch (error) {
    console.error("Profile fetch failed:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/follow/:targetId", verifyToken, async (req, res) => {
  const { targetId } = req.params;
  const currentUserId = req.user.id;

  if (currentUserId === targetId) {
    return res.status(400).json({ message: "You can't follow yourself" });
  }

  try {
    const targetUser = await User.findById(targetId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = targetUser.followers.includes(currentUserId);

    //Unfollow
    if (isFollowing) {
      targetUser.followers.pull(currentUserId);
      currentUser.following.pull(targetId);
    } else {
      targetUser.followers.push(currentUserId);
      currentUser.following.push(targetId);

      const notification = await Notification.create({
        sender: currentUserId,
        receiver: targetId,
        type: "follow",
      });

      const populated = await notification.populate("sender", "username profilePic");

      const io = req.app.get("io");
      io.to(populated.receiver.toString()).emit("notify", {
        _id: populated._id,
        sender: {
          _id: populated.sender._id,
          username: populated.sender.username,
          profilePic: populated.sender.profilePic
        },
        type: "follow",
        createdAt: new Date(),
        isRead: false
      });
    }

    await targetUser.save();
    await currentUser.save();

    res.status(200).json({
      isFollowing: !isFollowing,
      followersCount: targetUser.followers.length,
      followingCount: currentUser.following.length,
    });
  } catch (error) {
    console.error("Follow/unfollow failed:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Fetching current user failed:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/followers/:userId", verifyToken, async (req, res) => {
  const targetUserId = req.params.userId;
  const currentUserId = req.user.id;

  try {
    const targetUser = await User.findById(targetUserId).populate(
      "followers",
      "_id username name profilePic"
    );
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const followersWithStatus = await Promise.all(
      targetUser.followers.map(async (followerUser) => {
        const isFollowing = await User.exists({
          _id: currentUserId,
          following: followerUser._id,
        });

        return {
          _id: followerUser._id,
          username: followerUser.username,
          name: followerUser.name,
          profilePic: followerUser.profilePic,
          isFollowing: !!isFollowing,
        };
      })
    );

    res.status(200).json(followersWithStatus);
  } catch (error) {
    console.error("Fetching followers failed:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/following/:userId", verifyToken, async (req, res) => {
  const targetUserId = req.params.userId;
  const currentUserId = req.user.id;

  try {
    const targetUser = await User.findById(targetUserId).populate(
      "following",
      "_id username name profilePic"
    );
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const followingWithStatus = await Promise.all(
      targetUser.following.map(async (followedUser) => {
        const isFollowing = await User.exists({
          _id: currentUserId,
          following: followedUser._id,
        });

        return {
          _id: followedUser._id,
          username: followedUser.username,
          name: followedUser.name,
          profilePic: followedUser.profilePic,
          isFollowing: !!isFollowing,
        };
      })
    );
    res.status(200).json(followingWithStatus);
  } catch (error) {
    console.error("Fetching following failed:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/remove-follower/:targetUserId",verifyToken,async (req, res) => {
    const targetUserId = req.params.targetUserId;
    const currentUserId = req.user.id;

    try {
      // Remove target user from current user's followers
      await User.findByIdAndUpdate(currentUserId, {
        $pull: { followers: targetUserId },
      });

      // Remove current user from target user's following
      await User.findByIdAndUpdate(targetUserId, {
        $pull: { following: currentUserId },
      });

      res.status(200).json({ message: "Follower removed successfully" });
    } catch (error) {
      console.error("Error removing follower:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);
export default router;
