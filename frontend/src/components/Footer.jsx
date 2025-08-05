import React from 'react'

const Footer = () => {
    const currentYear = new Date().getFullYear(); 
  return (
    <div className='flex flex-col items-center justify-center py-8 px-4'>
      <div className='flex flex-wrap justify-center gap-4 max-w-4xl'>
        <p className='text-gray-500 cursor-pointer text-xs hover:text-gray-700'>Meta</p>
        <p className='text-gray-500 cursor-pointer text-xs hover:text-gray-700'>About</p>
        <p className='text-gray-500 cursor-pointer text-xs hover:text-gray-700'>Blog</p>
        <p className='text-gray-500 cursor-pointer text-xs hover:text-gray-700'>Jobs</p>
        <p className='text-gray-500 cursor-pointer text-xs hover:text-gray-700'>Help</p>
        <p className='text-gray-500 cursor-pointer text-xs hover:text-gray-700'>API</p>
        <p className='text-gray-500 cursor-pointer text-xs hover:text-gray-700'>Privacy</p>
        <p className='text-gray-500 cursor-pointer text-xs hover:text-gray-700'>Terms</p>
        <p className='text-gray-500 cursor-pointer text-xs hover:text-gray-700'>Locations</p>
        <p className='text-gray-500 cursor-pointer text-xs hover:text-gray-700'>Instagram Lite</p>
        <p className='text-gray-500 cursor-pointer text-xs hover:text-gray-700'>Threads</p>
        <p className='text-gray-500 cursor-pointer text-xs hover:text-gray-700'>Contact Uploading & Non-Users</p>
        <p className='text-gray-500 cursor-pointer text-xs hover:text-gray-700'>Meta Verified</p>
      </div>
      
      <div className='flex flex-col sm:flex-row items-center gap-4 mt-4'>
        <div className='flex items-center gap-2'>
          <span className='text-xs text-gray-500'>English</span>
          <svg className='w-3 h-3 text-gray-500' fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
        <p className='text-xs text-gray-500'>© {currentYear} Ulashgram from Meta</p>
      </div>
    </div>
  )
}

export default Footer
