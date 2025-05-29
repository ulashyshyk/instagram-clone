import React, { useRef,useState } from 'react'

const Upload = ({setIsModalOpen,updateUser}) => {
  const fileInputRef = useRef()
  const [image,setImage] = useState(null)

  const handleFileSelect = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    
    if(!file){
      return
    }

    setImage(file)

    const formData = new FormData()
    formData.append("profilePic",file)

    const authToken = localStorage.getItem("accessToken")
    
    try {
      const response = await fetch("http://localhost:5001/api/profile/profile-pic",{
        method:"POST",
        headers: {
          Authorization:`Bearer ${authToken}`,
        },
        body:formData,
      })

      const data = await response.json()
      if(response.ok){
        updateUser( { profilePic:data.user.profilePic } )
        setIsModalOpen(false)
        console.log("RESPONSE OK:",response.ok)
      }else{
        throw new Error("Upload failed")
      }
    } catch (error) {
      console.error("Upload error: ",error)
    }
  }

  const removeProfilePicture = async () => {
    const authToken = localStorage.getItem("accessToken")
    try {
      const response = await fetch("http://localhost:5001/api/profile/delete-profile-pic",{
        method:"POST",
        headers: {
          Authorization:`Bearer ${authToken}`,
        }
      })

      const data = await response.json()
      if(response.ok){
        updateUser({profilePic:null})
        setIsModalOpen(false)
      }else{
        throw new Error("Profile picture remove failed")
      }
    } catch (error) {
      console.error("Remove error: ",error) 
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="w-[400px] h-[230px] bg-white rounded-xl shadow-lg flex flex-col items-center p-4 pb-0">
        <p className='text-[20px] h-[30%]  mt-4'>Change Profile Photo</p>

        {/* Hidden File Input */}
        <input 
        type="file"
        ref={fileInputRef}
        className='hidden'
        accept='image/*'
        onChange={handleFileChange}
        />
        <button onClick={() => handleFileSelect()} className='border-t border-gray-200 w-[108.5%] text-[14px] border-1  font-medium h-[48px] text-[#0095F6] hover:bg-gray-100'>Upload Photo</button>
        <button onClick={() => removeProfilePicture()} className='border-t border-gray-200 w-[108.5%] text-[14px] font-medium h-[48px] text-[#ED4956] hover:bg-gray-100'>Remove Current Photo</button>
        <button className='border-t border-gray-200 w-[108.5%] text-[14px]  hover:bg-gray-100 hover:rounded-b-xl h-[50px]' onClick={() => setIsModalOpen(false)}>Cancel</button>
      </div>
    </div>
  )
}

export default Upload
