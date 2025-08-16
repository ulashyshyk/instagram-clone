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

const desktopSlideIn = {
  hidden: { x: -100 },
  visible: { x: 0 },
  exit: { x: 1000 },
};

const mobileSlideUp = {
  hidden: { y: '100%' },
  visible: { y: 0 },
  exit: { y: '100%' },
};

const NotificationModal = ({ isOpen, onClose, isSidebarCompact = false }) => {
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

  // Disable body vertical scroll on mobile when modal is open
  useEffect(() => {
    const isMobileViewport = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isOpen && isMobileViewport) {
      const originalBodyOverflowY = document.body.style.overflowY;
      const originalHtmlOverflowY = document.documentElement.style.overflowY;
      document.body.style.overflowY = 'hidden';
      document.documentElement.style.overflowY = 'hidden';
      return () => {
        document.body.style.overflowY = originalBodyOverflowY;
        document.documentElement.style.overflowY = originalHtmlOverflowY;
      };
    }
  }, [isOpen]);

  console.log('NotificationModal mounted', isOpen)
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={`fixed z-40 top-0 left-0 right-0 bottom-[60px] md:bottom-0 ${isSidebarCompact ? 'md:left-[85px]' : 'md:left-[249px]'} bg-black bg-opacity-20`}
            variants={backdrop}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />

          {/* Mobile full-screen bottom sheet */}
          <motion.div
            className="fixed top-0 left-0 right-0 bottom-[60px] z-50 bg-white dark:bg-black p-6 md:hidden flex flex-col"
            variants={mobileSlideUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'tween', ease: "easeInOut", duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close notifications"
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={onClose}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-black dark:text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-[24px] font-bold mb-6 pr-10 text-black dark:text-white">Notifications</h2>

            <div className='flex mt-5  max-h-[90%] flex-col gap-4 overflow-y-auto pr-1 w-[105%]'>
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className='flex flex-row items-center hover:bg-gray-100 dark:hover:bg-gray-800 p-1 hover:rounded-md  border-rounded-xl'
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
                      <p className='text-[14px] text-black dark:text-white'>
                        <span className='text-[13px] font-medium'>{notification.sender?.username}</span><br />
                        {notification.type === 'like' && ' liked your post.'}
                        {notification.type === 'comment' && ' commented on your post.'}
                        {notification.type === 'follow' && ' followed you.'}
                        {notification.type === 'message' && ' sent you a message.'}
                      </p>
                    </Link>
                    <p className='text-[12px] text-[#737373] dark:text-gray-400'>
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

          <motion.div
            className={`hidden md:block fixed top-0 ${isSidebarCompact ? 'left-[85px]' : 'left-[249px]'} h-full w-[320px] bg-white dark:bg-black z-50 p-6 shadow-lg border-l border-gray-200 dark:border-gray-800`}
            variants={desktopSlideIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'tween', ease: "easeInOut", duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close notifications"
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={onClose}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-black dark:text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-[24px] font-bold mb-6 text-black dark:text-white">Notifications</h2>

            <div className='flex mt-5  max-h-[90%] flex-col gap-4 overflow-y-auto pr-1 w-[105%]'>
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className='flex flex-row items-center hover:bg-gray-100 dark:hover:bg-gray-800 p-1 hover:rounded-md  border-rounded-xl'
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
                      <p className='text-[14px] text-black dark:text-white'>
                        <span className='text-[13px] font-medium'>{notification.sender?.username}</span><br />
                        {notification.type === 'like' && ' liked your post.'}
                        {notification.type === 'comment' && ' commented on your post.'}
                        {notification.type === 'follow' && ' followed you.'}
                        {notification.type === 'message' && ' sent you a message.'}
                      </p>
                    </Link>
                    <p className='text-[12px] text-[#737373] dark:text-gray-400'>
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
