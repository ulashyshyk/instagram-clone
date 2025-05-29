import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 300
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

const postSchema = new mongoose.Schema({
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  media: [
    {
      url: { type: String, required: true },
      type: { type: String, enum: ['image', 'video'], required: true }
    }
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: []
    }
  ],
  comments: {
    type: [commentSchema],
    default: []
  }
}, {
  timestamps: true
})

postSchema.virtual('likesCount').get(function () {
  return (this.likes || []).length
})

postSchema.virtual('commentCount').get(function () {
  return (this.comments || []).length
})

postSchema.set('toJSON', { virtuals: true })
postSchema.set('toObject', { virtuals: true })

const Post = mongoose.model("Post", postSchema)
export default Post
