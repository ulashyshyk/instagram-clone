import React from 'react';
import { Sun, Moon } from 'lucide-react';

const DarkModeToggle = ({ isDarkMode, toggleDarkMode, compact = false }) => {
  return (
    <button
      onClick={toggleDarkMode}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        isDarkMode 
          ? 'bg-gray-800' 
          : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-blue-600 transition-transform duration-200 ease-in-out ${
          isDarkMode ? 'translate-x-6' : 'translate-x-1'
        }`}
      >
        <div className="flex h-full w-full items-center justify-center">
          {isDarkMode ? (
            <Moon className="h-2.5 w-2.5 text-white" />
          ) : (
            <Sun className="h-2.5 w-2.5 text-white" />
          )}
        </div>
      </span>
      
      {/* Inactive icon on the opposite side */}
      <div className={`absolute ${isDarkMode ? 'left-1' : 'right-1'} flex h-4 w-4 items-center justify-center`}>
        {isDarkMode ? (
          <Sun className="h-2.5 w-2.5 text-gray-400" />
        ) : (
          <Moon className="h-2.5 w-2.5 text-gray-400" />
        )}
      </div>
    </button>
  );
};

export default DarkModeToggle;
