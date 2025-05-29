import React from 'react'

const Footer = () => {
    const currentYear = new Date().getFullYear(); 
  return (
    <div className='flex flex-col mt-10'>
      <div className='flex flex-row gap-2'>
        <p className='text-gray-500 cursor-pointer text-[10px] md:text-[12px]'>Meta</p>
        <p className='text-gray-500 cursor-pointer text-[10px] md:text-[12px]'>About</p>
        <p className='text-gray-500 cursor-pointer text-[10px] md:text-[12px]'>Blog</p>
        <p className='text-gray-500 cursor-pointer text-[10px] md:text-[12px]'>Jobs</p>
        <p className='text-gray-500 cursor-pointer text-[10px] md:text-[12px]'>Help</p>
        <p className='text-gray-500 cursor-pointer text-[10px] md:text-[12px]'>API</p>
        <p className='text-gray-500 cursor-pointer text-[10px] md:text-[12px]'>Privacy</p>
        <p className='text-gray-500 cursor-pointer text-[10px] md:text-[12px]'>Terms</p>
        <p className='text-gray-500 cursor-pointer text-[10px] md:text-[12px]'>Locations</p>
        <p className='text-gray-500 cursor-pointer text-[10px] md:text-[12px]'>Threads</p>     
      </div>
      <p className='mx-auto pb-5 text-gray-500 cursor-pointer text-[12px] mt-5'>© {currentYear} Ulashgram from Meta</p>
    </div>
  )
}

export default Footer
