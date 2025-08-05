import React from 'react';
import { Heart, MessageCircle, User, Camera, Star, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative w-full max-w-[380px] h-[580px] hidden lg:block">
      {/* Main phone mockup container with gradient border */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-[35px] p-2 shadow-2xl">
        <div className="w-full h-full bg-white rounded-[25px] overflow-hidden relative">
          
          {/* Gradient background with floating elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            {/* Floating gradient orbs */}
            <div className="absolute top-10 left-8 w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute top-32 right-12 w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-30 animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-16 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-25 animate-pulse delay-2000"></div>
          </div>
          
          {/* Photo 1 - Main center (Instagram post style) */}
          <div className="absolute top-12 left-8 w-64 h-80 rounded-lg overflow-hidden shadow-xl transform rotate-2 z-10 transition-transform hover:rotate-1 hover:scale-105 duration-300">
            <div className="w-full h-full bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center relative">
              {/* Mock photo content */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400/80 to-purple-600/80"></div>
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto backdrop-blur-sm">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <div className="text-white text-sm font-medium">@ulashgram</div>
              </div>
              
              {/* Story ring */}
              <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 p-[2px] animate-pulse">
                <div className="w-full h-full rounded-full bg-white p-[2px]">
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
                </div>
              </div>
              
              {/* Like and comment icons */}
              <div className="absolute bottom-4 left-4 flex items-center space-x-3">
                <Heart className="w-6 h-6 text-red-500 fill-current animate-pulse" />
                <MessageCircle className="w-5 h-5 text-white" />
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </div>
              
              {/* Like count */}
              <div className="absolute bottom-4 right-4 text-white text-xs font-semibold">
                2.4k likes
              </div>
            </div>
          </div>

          {/* Photo 2 - Top left (Story style) */}
          <div className="absolute top-8 left-2 w-32 h-40 rounded-lg overflow-hidden shadow-lg transform -rotate-12 z-20 hover:rotate-6 transition-transform duration-300">
            <div className="w-full h-full bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/70 to-blue-600/70"></div>
              <div className="relative z-10 text-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mb-2 mx-auto backdrop-blur-sm">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-white text-xs font-medium">@user123</div>
              </div>
              
              {/* Reaction bubble */}
              <div className="absolute -top-2 -right-2 bg-white rounded-full px-2 py-1 shadow-lg animate-bounce">
                <span className="text-xs">🔥</span>
              </div>
            </div>
          </div>

          {/* Photo 3 - Right side (Verified user) */}
          <div className="absolute top-32 right-4 w-28 h-36 rounded-lg overflow-hidden shadow-lg transform rotate-12 z-15 hover:-rotate-6 transition-transform duration-300">
            <div className="w-full h-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/70 to-orange-600/70"></div>
              <div className="relative z-10 text-center">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mb-2 mx-auto backdrop-blur-sm">
                  <Camera className="w-3 h-3 text-white" />
                </div>
                <div className="text-white text-xs font-medium">@verified</div>
              </div>
              
              {/* Green checkmark */}
              <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            </div>
          </div>

          {/* Photo 4 - Bottom area (Trending) */}
          <div className="absolute bottom-20 left-12 w-36 h-28 rounded-lg overflow-hidden shadow-lg transform -rotate-6 z-5 hover:rotate-3 transition-transform duration-300">
            <div className="w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/70 to-pink-600/70"></div>
              <div className="relative z-10 text-center">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mb-1 mx-auto backdrop-blur-sm">
                  <Heart className="w-3 h-3 text-white" />
                </div>
                <div className="text-white text-xs font-medium">#trending</div>
              </div>
            </div>
          </div>

          {/* Floating reaction emojis */}
          <div className="absolute top-20 right-8 animate-bounce delay-100 text-2xl">💜</div>
          <div className="absolute top-40 left-16 animate-bounce delay-300 text-xl">❤️</div>
          <div className="absolute bottom-32 right-12 animate-bounce delay-500 text-lg">😍</div>
          <div className="absolute top-60 left-6 animate-bounce delay-700 text-sm">✨</div>
          <div className="absolute top-16 right-20 animate-bounce delay-900 text-lg">🌟</div>

          {/* Story indicators at top */}
          <div className="absolute top-2 left-4 right-4 flex space-x-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex-1 h-[2px] bg-gradient-to-r from-pink-500 to-orange-500 rounded-full opacity-60 animate-pulse"></div>
            ))}
          </div>

          {/* Mock notification */}
          <div className="absolute top-16 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">3</div>
          
          {/* Floating stars */}
          <div className="absolute top-24 left-20 animate-ping delay-1000">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
          </div>
          <div className="absolute bottom-40 right-8 animate-ping delay-1500">
            <Star className="w-2 h-2 text-pink-400 fill-current" />
          </div>
          
          {/* App name at bottom */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-xs text-gray-600 font-medium">Ulashgram</div>
            <div className="text-xs text-gray-400">Share your moments</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;