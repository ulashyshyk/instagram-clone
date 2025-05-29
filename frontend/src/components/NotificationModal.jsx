import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useEffect} from 'react';
import profile_pic from '../assets/profile_pic.jpg';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { usePost } from '../context/PostContext';
import { useNotification } from '../context/NotificationContext';
const backdrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const slideIn = {
  hidden: { x: -100 },
  visible: { x: 0 },
  exit: { x: 1000 },
};

const NotificationModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const {setSelectedPostId} = usePost()
  const {notifications,markAllAsRead,refreshNotifications} = useNotification()

  function formatShortTimeAgo(dateString) {
    const date = dayjs(dateString);
    const now = dayjs();
    const diffInMinutes = now.diff(date, 'minute');
    
    if(diffInMinutes === 0){
      return `few seconds ago`
    }
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    }
    
    const diffInHours = now.diff(date, 'hour');
    if (diffInHours < 24) {
      return `${diffInHours}h`;
    }
    
    const diffInDays = now.diff(date, 'day');
    return `${diffInDays}d`;
  }
  useEffect(() => {
    if (isOpen) {
      refreshNotifications()
      markAllAsRead();
    }
  }, [isOpen]);

  console.log('NotificationModal mounted', isOpen)
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed top-0 left-[65px] md:left-[250px] right-0 bottom-0 bg-black bg-opacity-20"
            variants={backdrop}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />

          <motion.div
            className="fixed top-0 left-[65px] md:left-[250px] h-full w-[320px] bg-white z-50 p-6 shadow-lg border-l border-gray-200"
            variants={slideIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'tween', ease: "easeInOut", duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-[24px] font-bold mb-6">Notifications</h2>

            <div className='flex mt-5 max-h-[90%] flex-col gap-4 overflow-y-auto pr-1 w-[105%]'>
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className='flex flex-row items-center hover:bg-gray-100 hover:rounded-xs'
                >

                  <Link to={`/profile/${notification.sender?.username}`} onClick={onClose}>
                    <img
                      className='w-[44px] h-[44px] rounded-full object-cover'
                      src={notification.sender?.profilePic || profile_pic}
                      alt='Profile'
                    />
                  </Link>
                  <div className='flex flex-col ml-2 flex-1'>
                    <Link to={`/profile/${notification.sender?.username}`} onClick={onClose}>
                      <p className='text-[14px]'>
                        <span className='text-[13px] font-medium'>{notification.sender?.username}</span><br />
                        {notification.type === 'like' && ' liked your post.'}
                        {notification.type === 'comment' && ' commented on your post.'}
                        {notification.type === 'follow' && ' followed you.'}
                      </p>
                    </Link>
                    <p className='text-[12px] text-[#737373]'>
                      {formatShortTimeAgo(notification.createdAt)}
                    </p>
                  </div>
                  {(notification.type === 'like' || notification.type === 'comment') && notification.post && (
                    <button
                      onClick={() => {
                        setSelectedPostId(notification.post._id);
                        navigate(`/profile`); 
                        onClose(); 
                      }}
                    >
                    {notification.post?.media?.length > 0 ? (
                      notification.post.media[0].type === 'video' ? (
                        <video
                          src={notification.post.media[0].url}
                          className="ml-5 w-[45px] h-[45px] object-cover rounded-lg"
                          muted
                          playsInline
                        />
                      ) : (
                        <img
                          src={notification.post.media[0].url}
                          className="ml-5 w-[45px] h-[45px] object-cover rounded-lg"
                          alt="Post"
                        />
                      )
                    ) : (
                      <img
                        src={notification.post?.image}
                        className="ml-5 w-[45px] h-[45px] object-cover rounded-lg"
                        alt="Post"
                      />
)}
                    </button>
                  )}
                </div>
              ))}
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.getElementById('modal-root')
  );
};

export default NotificationModal;
