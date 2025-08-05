import React, { useState } from 'react';
import { Heart, MessageCircle, User, Camera } from 'lucide-react';

// Modified Hero Component
const Hero = () => {
  return (
    <div className="relative w-full max-w-[380px] h-[580px] hidden lg:block">
      <div className="absolute inset-0 bg-black rounded-[35px] p-2 shadow-2xl">
        <div className="w-full h-full bg-white rounded-[25px] overflow-hidden relative">
          
          <div className="absolute top-12 left-8 w-64 h-80 rounded-lg overflow-hidden shadow-lg transform rotate-2 z-10 transition-transform hover:rotate-1 hover:scale-105 duration-300">
            <div className="w-full h-full bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
              <Camera className="w-16 h-16 text-white/30" />
            </div>
            <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 p-[2px] animate-pulse">
              <div className="w-full h-full rounded-full bg-white p-[2px]">
                <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 flex items-center space-x-2">
              <Heart className="w-6 h-6 text-red-500 fill-current animate-pulse" />
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="absolute top-8 left-2 w-32 h-40 rounded-lg overflow-hidden shadow-md transform -rotate-12 z-20 hover:rotate-6 transition-transform duration-300">
            <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
              <User className="w-8 h-8 text-white/40" />
            </div>
            <div className="absolute -top-2 -right-2 bg-white rounded-full px-2 py-1 shadow-lg animate-bounce">
              <span className="text-xs">🔥</span>
            </div>
          </div>

          <div className="absolute top-32 right-4 w-28 h-36 rounded-lg overflow-hidden shadow-md transform rotate-12 z-15 hover:-rotate-6 transition-transform duration-300">
            <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <Camera className="w-6 h-6 text-white/40" />
            </div>
            <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
          </div>

          <div className="absolute bottom-20 left-12 w-36 h-28 rounded-lg overflow-hidden shadow-md transform -rotate-6 z-5 hover:rotate-3 transition-transform duration-300">
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white/40" />
            </div>
          </div>

          <div className="absolute top-20 right-8 animate-bounce delay-100 text-2xl">💜</div>
          <div className="absolute top-40 left-16 animate-bounce delay-300 text-xl">❤️</div>
          <div className="absolute bottom-32 right-12 animate-bounce delay-500 text-lg">😍</div>
          <div className="absolute top-60 left-6 animate-bounce delay-700 text-sm">✨</div>

          <div className="absolute top-2 left-4 right-4 flex space-x-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex-1 h-[2px] bg-gradient-to-r from-pink-500 to-orange-500 rounded-full opacity-60 animate-pulse"></div>
            ))}
          </div>

          <div className="absolute top-16 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">3</div>
        </div>
      </div>
    </div>
  );
};

export default Hero