import React, { useState } from 'react'
import camera2 from '../assets/camera2.png'
import PostModal from './PostModal'
const SharePhotos = () => {
  const [isModalOpen,setIsModalOpen] = useState(false)
  return (
    <div className='mb-auto flex flex-col items-center gap-2'>
        <img className='w-[100px] h-[100px] rounded-full flex items-center justify-center md:mr-2 object-cover' src={camera2} />
        <p className='font-bold text-[30px]'>Share Photos</p>
        <p className='text-[14px]'>When you share photos, they will appear on your profile.</p>
        <button onClick={()=>setIsModalOpen(true)} className='text-[#0095f6] hover:text-blue-300 cursor-pointer'>Share your first photo</button>
        {isModalOpen && <PostModal setPostModalOpen={setIsModalOpen}/>}
    </div>
  )
}

export default SharePhotos
