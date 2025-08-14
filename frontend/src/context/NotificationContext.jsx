import { createContext, useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { io } from 'socket.io-client';
import NotificationToast from '../components/NotificationToast';
import toast from 'react-hot-toast';
const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const {isAuthenticated} = useAuth()
  const {user} = useAuth()
  const socket = useRef(null)

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if(!token) return
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get('http://localhost:5001/api/notifications/me', config);
      setNotifications(response.data);

      const unread = response.data.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put('http://localhost:5001/api/notifications/mark-all-read', {}, config);
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true })))

    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const refreshNotifications = async() => {
    await fetchNotifications()
  }

  useEffect(() => {
    if (!isAuthenticated || !user) return;
  
    socket.current = io("http://localhost:5001");
    socket.current.emit("join", user._id);
  
    socket.current.on("notify", (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      toast.custom((t) => (
        <NotificationToast
          notification={notification}
          dismiss={() => toast.dismiss(t.id)}
        />
      ));
    });
  
    return () => socket.current.disconnect();
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        markAllAsRead,
        refreshNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
