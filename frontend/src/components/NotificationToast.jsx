import React from 'react'
import profile_pic from '../assets/profile_pic.jpg'
import { Link } from 'react-router-dom'
const NotificationToast = ({notification,dismiss}) => {
    const {sender,type} = notification

    const messageMap = {
        like: 'liked your post',
        comment: 'commented on your post',
        follow: 'started following you',
        message: 'sent you a message'
    }

  return (
<div
      onClick={dismiss}
      className="flex items-center space-x-3 p-3 rounded-lg shadow-md bg-white border w-[300px] cursor-pointer"
    >
      <img
        src={sender?.profilePic || profile_pic}
        alt="profile"
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="text-sm">
        <Link to={`/profile/${sender?.username}`} className="font-semibold">
          {sender?.username}
        </Link>{' '}
        {messageMap[type]}
      </div>
    </div>
  )
}

export default NotificationToast
