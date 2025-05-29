import { useState } from 'react'
import { FaHeart, FaRegHeart, FaRegComment } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { usePost } from '../context/PostContext'

const PostActions = ({ post, onLike,onCommentClick,type }) => {
  const {user} = useAuth()
  const [liked, setLiked] = useState(post.likes.includes(user._id))
  const [likesCount, setLikesCount] = useState(post.likes.length || 0)
  const {toggleLike} = usePost()
  
  dayjs.extend(relativeTime)
  const handleLike = async () => {
    const updated = await toggleLike(post._id)
    setLikesCount(updated.likes.length)
    setLiked(updated.likes.includes(user._id))
    if (onLike) onLike(updated)
  }

  return (
    <div className="px-4 pt-3 pb-4">
      <div className="flex items-center gap-4 text-xl">
        <button onClick={handleLike} className="focus:outline-none">
          {liked ? (
            <FaHeart className="text-red-500 transition-transform hover:scale-110" />
          ) : (
            <FaRegHeart className="text-gray-700 hover:scale-110 transition-transform" />
          )}
        </button>
          
        <FaRegComment onClick={onCommentClick} className="text-gray-700 hover:scale-110 transition-transform cursor-pointer" />
      </div>
      {likesCount === 0 ? (<p className='text-[14px] mt-1'>Be the first to <span className='font-medium'>like this</span></p>) 
      : (<p className='text-[14px] font-medium mt-1'>{likesCount} {likesCount === 1 ? 'like' : 'likes'}</p>)}
      
      {type !== 'feed' && 
      (<p className="text-xs text-gray-400">
        {dayjs(post.createdAt).fromNow()}
      </p>)        
        } 

    </div>
  )
}

export default PostActions
