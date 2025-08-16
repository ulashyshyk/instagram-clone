import React from 'react'
import { IoIosClose } from "react-icons/io";
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ReactDOM from 'react-dom'
import { Settings, Bookmark, Clock, Heart, LogOut, Shield, HelpCircle, Info, Moon, Sun } from 'lucide-react'
import DarkModeToggle from './DarkModeToggle'

const Modal = ({setIsModalOpen}) => {
    const {logout} = useAuth()
    const { isDarkMode, toggleDarkMode } = useTheme()
    
    const handleLogout = () => {
        localStorage.removeItem("selectedChatUser")
        logout()
    }

    const menuItems = [
        { icon: Settings, label: "Settings", onClick: () => {} },
        { icon: Bookmark, label: "Saved", onClick: () => {} },
        { icon: Clock, label: "Your activity", onClick: () => {} },
        { icon: Heart, label: "Favorites", onClick: () => {} },
        { icon: Shield, label: "Privacy", onClick: () => {} },
        { icon: HelpCircle, label: "Help", onClick: () => {} },
        { icon: Info, label: "About", onClick: () => {} },
    ]

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center sm:items-center">
      <div className="bg-white dark:bg-black w-full max-w-sm rounded-t-2xl sm:rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-center p-4 border-b border-gray-200 dark:border-gray-800 relative">
          <h3 className="text-lg font-semibold dark:text-white">More</h3>
                      <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            >
              <IoIosClose className='text-2xl dark:text-white'/>
            </button>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <item.icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <span className="text-sm font-medium dark:text-white">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Dark Mode Toggle - Mobile Only */}
        <div className="border-t border-gray-200 dark:border-gray-800 my-2"></div>
        <div className="p-2">
          <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-lg">
            <div className="flex items-center gap-3">
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
              <span className="text-sm font-medium dark:text-white">
                {isDarkMode ? "Light mode" : "Dark mode"}
              </span>
            </div>
            <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-800 my-2"></div>

        {/* Logout Button */}
        <div className="p-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-lg"
          >
            <LogOut className="w-5 h-5 text-red-500" />
            <span className="text-sm font-medium text-red-500">Log out</span>
          </button>
        </div>

        {/* Bottom padding for mobile */}
        <div className="h-4 sm:hidden"></div>
      </div>
    </div>,
    document.getElementById('modal-root')
  )
}

export default Modal
