import React, { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import Upload from './Upload'
import profile_pic from '../assets/profile_pic.jpg'
import { Link } from 'react-router-dom'
import { usePost } from '../context/PostContext'
import axios from 'axios'
import FollowersFollowingModal from './FollowersFollowingModal'
const Profile = () => {
    const [user,setUser] = useState(null)
    const {updateUser } = useAuth()
    const [isModalOpen,setIsModalOpen] = useState(false)
    const [isFollowingFollowersModalOpen,setIsFollowingFollowersModalOpen] = useState(false)
    const [modalType,setModalType] = useState(null)
    const {posts} = usePost()

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const config ={ headers: { Authorization: `Bearer ${token}` } };

            const response = await axios.get('http://localhost:5001/api/profile/me', config);

            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        }
    };

    useEffect(() => {
        fetchProfile()
    },[])

    if (!user) {
        return <div className="p-4">Loading profile...</div>;
      }

  return (
    <div className='mt-10 md:w-[400px]  lg:w-[700px] md:p-2 select-none'>
        <div className='flex flex-row gap-2 md:gap-5'>
            <button onClick={()=>setIsModalOpen(true) }><img className='w-[100px] h-[100px] md:w-[150px] md:h-[150px] rounded-full bg-black text-center flex items-center justify-center md:mr-2 object-cover' src={user.profilePic || profile_pic}/></button>
            {isModalOpen && <Upload setIsModalOpen={setIsModalOpen} updateUser={updateUser}/>}
            <div className='w-[65%]'>
                <div className='flex flex-row mt-3 gap-1 md:gap-10 md:ml-6 items-center'>
                    <p className='md:text-xl font-medium text-black dark:text-white'>{user.username}</p>
                    <Link to='/edit-profile' className='text-sm bg-gray-200 dark:bg-gray-700 py-2 px-2 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 active:bg-gray-200 dark:active:bg-gray-700 select-none text-black dark:text-white'>Edit Profile</Link>
                </div>
                <div className='flex flex-row text-[13px] md:text-[16px] gap-3 md:gap-6 bg py-2'>
                    <p className='text-black dark:text-white'>{posts.length}<span className='text-gray-500 dark:text-gray-400 ml-1.5'>posts</span> </p>
                   
                    <button 
                     onClick={ () => {
                      setModalType('followers'); 
                      setIsFollowingFollowersModalOpen(true)
                     }
                     }
                    className='text-black dark:text-white'>{user.followers.length}<span className='text-gray-500 dark:text-gray-400 ml-1.5'>followers</span> 
                    </button>

                    <button
                     onClick={() => {
                        setModalType('following');
                        setIsFollowingFollowersModalOpen(true)
                     }}
                    className='text-black dark:text-white'>{user.following.length}<span className='text-gray-500 dark:text-gray-400 ml-1.5'>following</span> 
                    </button>

                    <FollowersFollowingModal 
                        isOpen={isFollowingFollowersModalOpen}
                        onClose={() => setIsFollowingFollowersModalOpen(false)}
                        type={modalType}
                        userId={user._id}
                    />
                    
                </div>
                <div className='py-2  text-[13px] md:text-[15px]'>
                    <p className='font-medium text-black dark:text-white'>{user.name}</p>
                    <p className='cursor-pointer text-black dark:text-white'>{user.bio}</p>
                </div>
            </div>       
        </div>
    </div>
  )
}

export default Profile
