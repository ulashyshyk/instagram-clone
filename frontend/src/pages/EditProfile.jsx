import React from 'react'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import EditProfileForm from '../components/EditProfileForm'

const EditProfile = () => {
  return (
    <div className='flex flex-row h-[120vh] pb-[65px] md:pb-0 overflow-x-hidden'>
      <Sidebar />
        <div className='flex flex-col w-full  p-4 md:ml-[249px] justify-between items-center'>
            <EditProfileForm />
            <Footer /> 
        </div>
    </div>
  )
}

export default EditProfile
