import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, // who triggered it
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, // who receives it
    type: { type: String, enum: ['follow', 'like', 'comment'], required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }, // optional, for like/comment
    isRead: { type: Boolean, default: false },
  }, { timestamps: true });

const Notification = mongoose.model('Notification',notificationSchema);
export default Notification;