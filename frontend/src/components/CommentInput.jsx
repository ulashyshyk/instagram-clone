import { forwardRef, useRef, useState } from "react";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import { usePost } from "../context/PostContext";
import { useImperativeHandle } from "react";
const CommentInput = forwardRef(({ postId, onCommentAdded }, ref) => {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focusInput: () => inputRef.current?.focus(),
  }));

  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [ShowEmojiPicker, setShowEmojiPicker] = useState(false);
  const { addComment } = usePost();

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    setLoading(true);

    try {
      const updatedPost = await addComment(postId, comment.trim());
      setComment("");
      if (onCommentAdded) {
        onCommentAdded(updatedPost);
      }
    } catch (err) {
      console.error("Failed to post comment", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-3 flex flex-row  gap-2">
      {ShowEmojiPicker && (
        <div>
          <EmojiPicker
            onEmojiClick={(emojiData) => {
              setComment((prev) => prev + emojiData.emoji);
              setShowEmojiPicker(false);
            }}
          />
        </div>
      )}
      <button
        type="button"
        onClick={() => setShowEmojiPicker(true)}
        className="text-2xl mb-1 hover:scale-110 transition mt-2"
      >
        <MdOutlineEmojiEmotions />
      </button>
      <input
        ref={inputRef}
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyDown={(e) => {
          if (
            e.key === 'Enter' &&
            !e.shiftKey &&
            // Avoid submitting while using IME/composition
            !(e.nativeEvent && e.nativeEvent.isComposing)
          ) {
            e.preventDefault()
            if (!loading) {
              handleSubmit()
            }
          }
        }}
        placeholder="Add a comment..."
        className="flex-1 px-4 py-2 text-sm border-none outline-none focus:ring-0 focus:outline-none active:outline-none"
      />
      <button
        onClick={handleSubmit}
        disabled={!comment.trim() || loading}
        className={`text-sm font-semibold text-blue-500 hover:text-blue-600 disabled:text-gray-300`}
      >
        Post
      </button>
    </div>
  );
});

export default CommentInput;
