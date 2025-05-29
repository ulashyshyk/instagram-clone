import React, { useEffect, useRef, useState } from 'react'
import ReactDom from 'react-dom'
import { MdOutlinePermMedia } from "react-icons/md";
import { usePost } from '../context/PostContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import profile_pic from '../assets/profile_pic.jpg'
import EmojiPicker from 'emoji-picker-react';
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { useToast } from '@chakra-ui/react';

const PostModal = ({ setPostModalOpen }) => {
  const fileInputRef = useRef()
  const { createPost } = usePost()
  const { user } = useAuth()
  const toast = useToast()
  const [description, setDescription] = useState('')
  const [step, setStep] = useState('select')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [mediaFiles, setMediaFiles] = useState([])
  const [mediaPreviews, setMediaPreviews] = useState([])
  const [mediaIndex, setMediaIndex] = useState(0)

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setMediaFiles(prev => [...prev, ...files])
    setMediaPreviews(prev => [...prev, ...newPreviews])
  }

  const handleNext = () => {
    if (mediaFiles.length > 0) {
      setStep('caption')
    }
  }

  const handlePost = async () => {
    if (mediaFiles.length === 0) return
    setIsSharing(true)
    const formData = new FormData()
    mediaFiles.forEach(file => formData.append('media', file))
    if (description) formData.append('description', description)

    const result = await createPost(formData)
    if (result.success) {
      setTimeout(() => {
        setPostModalOpen(false)
        setDescription('')
        setMediaFiles([])
        setMediaPreviews([])
        setStep('select')
        setMediaIndex(0)
        setIsSharing(false)
        toast({
          title: "Post created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top"
        });
      }, 1000)
    } else {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setTimeout(() => setIsSharing(false), 1000)
    }
  }

  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${scrollbarWidth}px`
    return () => {
      document.body.style.overflow = 'auto'
      document.body.style.paddingRight = '0px'
    }
  }, [])

  return (
    <>
      {showEmojiPicker && ReactDom.createPortal(
        <div className="fixed inset-0 z-[10001] bg-black bg-opacity-40 flex items-center justify-center ">
          <div className="relative bg-white rounded-lg shadow-lg p-2 w-[390px] h-[350px] overflow-auto">
            <button
              onClick={() => setShowEmojiPicker(false)}
              className="absolute top-1 right-2 text-lg text-gray-600 hover:text-red-500"
            >✕</button>
            <EmojiPicker
              onEmojiClick={(emojiData) => {
                setDescription(prev => prev + emojiData.emoji)
                setShowEmojiPicker(false)
              }}
            />
          </div>
        </div>,
        document.getElementById('modal-root')
      )}

      {ReactDom.createPortal(
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center">
          <div className={`relative flex flex-col bg-white rounded-xl shadow-lg items-center transition-all duration-300 ${step === 'caption' ? 'w-[700px] h-[560px] sm:h-[520px]' : 'w-[370px] md:w-[450px] h-[470px]'}`}>
            <p className='text-[16px] text-center border-b border-gray-200 w-full pb-3 pt-3'>Create new post</p>

            {step === 'caption' ? (
              <div className="flex flex-col w-[105%] sm:flex-row gap-4 ml-5 sm:ml-9 h-[81%]">
                <div className="relative flex-shrink-0 w-full sm:w-[60%] h-[320px] sm:h-[420px]">
                {mediaFiles[mediaIndex]?.type.startsWith('video') ? (
                  <video src={mediaPreviews[mediaIndex]} controls className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <img src={mediaPreviews[mediaIndex]} className="w-full h-full object-cover rounded-lg" />
                  )}

                  {mediaIndex > 0 && (
                    <button onClick={() => setMediaIndex(prev => prev - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full">←</button>
                  )}

                  {mediaIndex < mediaPreviews.length - 1 && (
                    <button onClick={() => setMediaIndex(prev => prev + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full">→</button>
                  )}
                </div>

                <div className='mr-[60px] sm:p-3 w-full relative'>
                  <div className='hidden sm:flex flex-row gap-2 items-center'>
                    <img className='h-[30px] w-[30px] rounded-full object-cover' src={user.profilePic || profile_pic} />
                    <p>{user.username}</p>
                  </div>

                  <textarea
                    placeholder="Write a caption..."
                    className={`w-full h-[60px] sm:h-[100px] border-none focus:outline-none rounded-lg p-2 text-sm resize-none ${description.length > 249 ? 'border-red-400' : ''}`}
                    rows="10"
                    value={description}
                    maxLength={250}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <p className='absolute top-1/2 mr-[-70px] right-1/4 sm:right-1 sm:top-1/3 text-gray-500 text-[12px] font-medium sm:mr-[-20px] p-1'>{description.length}/250</p>

                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(true)}
                    className='text-xl hover:scale-110 transition mt-2'
                  >
                    <MdOutlineEmojiEmotions />
                  </button>
                </div>
              </div>
            ) : (
              mediaPreviews.length > 0 ? (
                <div className="relative w-full h-[350px]">
                  {mediaFiles[mediaIndex]?.type.startsWith('video') ? (
                    <video src={mediaPreviews[mediaIndex]} controls className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <img src={mediaPreviews[mediaIndex]} className="w-full h-full object-cover rounded-lg" />
                  )}

                  {mediaIndex > 0 && (
                    <button onClick={() => setMediaIndex(prev => prev - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full">←</button>
                  )}

                  {mediaIndex < mediaPreviews.length - 1 && (
                    <button onClick={() => setMediaIndex(prev => prev + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full">→</button>
                  )}
                </div>
              ) : (
                <MdOutlinePermMedia className='text-[140px] mt-auto cursor-pointer' />
              )
            )}

            {mediaPreviews.length === 0 && (
              <button onClick={() => fileInputRef.current.click()} className='text-[14px] mx-auto mt-5 p-2 w-[150px] hover:bg-blue-600 rounded-xl font-medium text-white ml-auto bg-[#0095F6] mb-20'>Select photo</button>
            )}

            <input
              type="file"
              ref={fileInputRef}
              className='hidden'
              accept='image/*,video/*'
              multiple
              onChange={handleFileChange}
            />

            {step === 'select' && mediaPreviews.length > 0 && (
              <>
                <button
                  onClick={handleNext}
                  className="absolute top-3 right-3 px-4 py-1 rounded-xl text-white bg-blue-600 hover:bg-blue-700"
                >Next</button>
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute top-3 left-3 px-4 py-1 rounded-xl text-white bg-blue-600 hover:bg-blue-700"
                >Add More</button>
              </>
            )}

            {step === 'caption' && mediaPreviews.length > 0 && (
              <div className="absolute top-0 right-0.5 gap-2 px-4 mt-2 flex flex-row items-center">
                <button
                  onClick={handlePost}
                  disabled={isSharing}
                  className={`ml-4 flex pb-1  items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-xl hover:bg-blue-700 ${isSharing ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSharing && (
                    <span className="mr-[-2px] h-4 w-4 border-2 border-white border-t-transparent animate-spin rounded-full"></span>
                  )}
                  {isSharing ? 'Sharing...' : 'Share'}
                </button>
              </div>
            )}

            <button className='border-t border-gray-200 w-full text-[14px] hover:bg-gray-100 hover:rounded-b-xl h-[50px] mt-auto sm:mt-0' onClick={() => setPostModalOpen(false)}>Cancel</button>
          </div>
        </div>,
        document.getElementById('modal-root')
      )}
    </>
  )
}

export default PostModal
