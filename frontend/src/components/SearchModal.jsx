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

const slideIn = {
  hidden: { x: -100},   
  visible: { x: 0 },
  exit: { x: 1000 },
}

const SearchModal = ({ isOpen, onClose }) => {
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
            className="fixed top-0 left-[65px] md:left-[250px] h-full w-[300px] bg-white z-50 p-6 shadow-lg border-l border-gray-200"
            variants={slideIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'tween',ease:"easeInOut",duration:0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6"> Search</h2>
            <div className="flex items-center w-full bg-gray-200 rounded-lg border border-gray-300 px-2">
              <IoIosSearch className="text-2xl text-gray-600" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full text-[15px] p-2 bg-gray-200 border-none outline-none focus:ring-0 focus:outline-none active:outline-none"
                autoFocus
                onChange={(e) => setQuery(e.target.value)}
              />
          </div>

          <div className='flex mt-5 max-h-[80%] flex-col gap-4 overflow-y-auto pr-1'>
            {results.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className='flex flex-row items-center hover:bg-gray-200 hover:p-0.5 hover:rounded-lg'
                key={user._id}
                onClick={onClose}
              >
                <img className='w-[50px] h-[50px] rounded-full object-cover'  src={user.profilePic || profile_pic} />
                <div className='flex flex-col'>
                  <p className='text-[14px] font-medium ml-2'>{user.username}</p>
                  <p className='text-[14px]  ml-2 text-[#737373]'>{user.name}</p>
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
