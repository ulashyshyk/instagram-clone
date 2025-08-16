import { motion, AnimatePresence } from 'framer-motion'
import { IoIosSearch } from "react-icons/io";
import {createPortal} from 'react-dom'
import { useEffect,useState } from 'react';
import axios from 'axios';
import profile_pic from '../assets/profile_pic.jpg'
import { Link } from 'react-router-dom';

const backdrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
}

const desktopSlideIn = {
  hidden: { x: -100},   
  visible: { x: 0 },
  exit: { x: 1000 },
}

const mobileSlideUp = {
  hidden: { y: '100%' },
  visible: { y: 0 },
  exit: { y: '100%' },
}

const SearchModal = ({ isOpen, onClose, isSidebarCompact = false }) => {
  const [query,setQuery] = useState("")
  const [results,setResults] = useState([])

  const fetchResults = async() => {
    const token = localStorage.getItem("accessToken")
    try {
      const response = await axios.get(`http://localhost:5001/api/profile/search?query=${query}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setResults(response.data.users)
      console.log(results)
    } catch (error) {
      console.error("Search failed",error)
    }
  }

  useEffect(() => {
    const delay = setTimeout(() => {
      if(query.trim()) fetchResults()
      else setResults([])
    },300)

    return () => clearTimeout(delay)
  },[query])

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

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={`fixed z-40 top-0 left-0 right-0 bottom-[80px] md:bottom-0 ${isSidebarCompact ? 'md:left-[85px]' : 'md:left-[249px]'} bg-black bg-opacity-20`}
            variants={backdrop}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />

          {/* Mobile full-screen bottom sheet */}
          <motion.div
            className="fixed top-0 left-0 right-0 bottom-[80px] z-50 bg-white dark:bg-black p-6 md:hidden flex flex-col"
            variants={mobileSlideUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'tween', ease: "easeInOut", duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close search"
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={onClose}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-black dark:text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-6 pr-10 text-black dark:text-white"> Search</h2>
            <div className="flex items-center w-full bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 px-2">
              <IoIosSearch className="text-2xl text-gray-600 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full text-[15px] p-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-none outline-none focus:ring-0 focus:outline-none active:outline-none"
                autoFocus
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className='flex mt-5  max-h-[90%] flex-col gap-4 overflow-y-auto pr-1 w-[105%]'>
              {results.map((user) => (
                <Link
                  to={`/profile/${user.username}`}
                  className='flex flex-row items-center hover:bg-gray-200 dark:hover:bg-gray-800 hover:p-0.5 hover:rounded-lg'
                  key={user._id}
                  onClick={onClose}
                >
                  <img className='w-[50px] h-[50px] rounded-full object-cover'  src={user.profilePic || profile_pic} />
                  <div className='flex flex-col'>
                    <p className='text-[14px] font-medium ml-2 text-black dark:text-white'>{user.username}</p>
                    <p className='text-[14px]  ml-2 text-[#737373] dark:text-gray-400'>{user.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            className={`hidden md:block fixed top-0 ${isSidebarCompact ? 'left-[85px]' : 'left-[249px]'} h-full w-[300px] bg-white dark:bg-black z-50 p-6 shadow-lg border-l border-gray-200 dark:border-gray-800`}
            variants={desktopSlideIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'tween',ease:"easeInOut",duration:0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6 text-black dark:text-white"> Search</h2>
            <div className="flex items-center w-full bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 px-2">
              <IoIosSearch className="text-2xl text-gray-600 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full text-[15px] p-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-none outline-none focus:ring-0 focus:outline-none active:outline-none"
                autoFocus
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className='flex mt-5 max-h-[80%] flex-col gap-4 overflow-y-auto pr-1'>
              {results.map((user) => (
                <Link
                  to={`/profile/${user.username}`}
                  className='flex flex-row items-center hover:bg-gray-200 dark:hover:bg-gray-800 hover:p-0.5 hover:rounded-lg'
                  key={user._id}
                  onClick={onClose}
                >
                  <img className='w-[50px] h-[50px] rounded-full object-cover'  src={user.profilePic || profile_pic} />
                  <div className='flex flex-col'>
                    <p className='text-[14px] font-medium ml-2 text-black dark:text-white'>{user.username}</p>
                    <p className='text-[14px]  ml-2 text-[#737373] dark:text-gray-400'>{user.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
        document.getElementById('modal-root')
  )
}

export default SearchModal
