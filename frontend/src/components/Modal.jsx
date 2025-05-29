import React from 'react'
import { IoIosClose } from "react-icons/io";
import { useAuth } from '../context/AuthContext';
import ReactDOM from 'react-dom'


const Modal = ({setIsModalOpen}) => {
    const {logout} = useAuth()
  return ReactDOM.createPortal(
    <div className="fixed bottom-8 left-7 h-[500px] w-[250px] bg-gray-100  z-50 flex justify-center items-center rounded-lg">
      <button onClick={() => setIsModalOpen(false)}><IoIosClose className='text-2xl'/></button>
      <button onClick={() =>{
        localStorage.removeItem("selectedChatUser")
        logout()
      }}>Log out</button>
    </div>,
    document.getElementById('modal-root')
  )
}

export default Modal
