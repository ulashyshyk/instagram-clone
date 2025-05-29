import React, { useEffect, useState } from 'react';
import axios from 'axios';
import profile_pic from '../assets/profile_pic.jpg';
import { Link } from 'react-router-dom';
import Spinner from './Spinner';

const FollowersFollowingModal = ({ isOpen, onClose, type, userId }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loadingUserId, setLoadingUserId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchList();
      fetchCurrentUser();
    }
  }, [isOpen, type, userId]);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get('http://localhost:5001/api/profile/me', config);
      setCurrentUserId(response.data._id);
    } catch (error) {
      console.error("Fetching current user failed:", error);
    }
  };

  const fetchList = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`http://localhost:5001/api/profile/${type}/${userId}`, config);

      setList(response.data);
    } catch (error) {
      console.error(`Failed to load ${type}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async (targetUserId) => {
    try {
      setLoadingUserId(targetUserId);
      const token = localStorage.getItem('accessToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`http://localhost:5001/api/profile/follow/${targetUserId}`, {}, config);

      setList(prevList => prevList.map(user =>
        user._id === targetUserId ? { ...user, isFollowing: !user.isFollowing } : user
      ));
    } catch (error) {
      console.error("Toggle follow failed:", error);
    } finally {
      setLoadingUserId(null);
    }
  };

  const handleRemoveFollower = async (targetUserId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:5001/api/profile/remove-follower/${targetUserId}`, config);

      setList(prevList => prevList.filter(user => user._id !== targetUserId));
    } catch (error) {
      console.error("Remove follower failed:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg w-[400px] h-[450px]">
        <p className='text-center text-[16px] font-medium mt-2 border-b-2 pb-2 border-gray-200'>{type === 'following' ? 'Following' : 'Followers'}</p>
        <button className='absolute top-1 right-1 text-[18px] mr-1 mt-0.5' onClick={onClose}>✕</button>
        {loading ? (
          <div className='p-4 text-center'>Loading...</div>
        ) : (
          <div className='flex h-[90%] flex-col gap-1 overflow-y-scroll'>
            {list.map(user => (
              <div
                className='flex flex-row items-center justify-between px-3 py-2 hover:bg-gray-100'
                key={user._id}
              >
                <Link
                  to={user._id === currentUserId ? '/profile' : `/profile/${user.username}`}
                  className='flex flex-row items-center'
                  onClick={onClose}
                >
                  <img
                    className='w-[40px] h-[40px] rounded-full object-cover'
                    src={user.profilePic || profile_pic}
                    alt='profile'
                  />
                  <div className='flex flex-col ml-2'>
                    <p className='text-[14px] font-medium'>{user.username}</p>
                    <p className='text-[14px] text-[#737373]'>{user.name}</p>
                  </div>
                </Link>
                {type === 'followers' && userId === currentUserId ? (
                  <button
                    onClick={() => handleRemoveFollower(user._id)}
                    className="`flex items-center justify-center gap-2 px-4 py-2 font-medium text-sm rounded-xl bg-[#EFEFEF] text-black hover:bg-gray-300"
                  >
                    Remove
                  </button>
                ) : (
                  user._id !== currentUserId && (
                    <button
                      onClick={() => handleFollowToggle(user._id)}
                      disabled={loadingUserId === user._id}
                      className={`flex items-center justify-center gap-2 px-4 py-2 font-medium text-sm rounded-xl ${
                        user.isFollowing ? 'bg-[#EFEFEF] text-black hover:bg-gray-300' : 'bg-[#0095F6] hover:bg-blue-400 text-white'
                      }`}
                    >
                      {loadingUserId === user._id ? <Spinner /> : (user.isFollowing ? 'Following' : 'Follow')}
                    </button>
                  )
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowersFollowingModal;
