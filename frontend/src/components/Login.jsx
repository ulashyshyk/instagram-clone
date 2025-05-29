import React, { useState } from 'react'
import { Link ,useNavigate} from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '@chakra-ui/react'

const Login = () => {
  const [password, setPassword] = useState()
  const [email, setEmail] = useState()
  const navigate = useNavigate()
  const {login,authLoading} = useAuth()
  const [showPassword,setShowPassword] = useState(false)
  const toast = useToast()
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Email and password are required.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
  
    try {
      await login(email, password)
      toast({
        title: "Login Successful",
        description: "Redirecting to home page...",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top"
      });
      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch (err) {
      console.error("Login Error:", err.response?.data?.message || err.message);
      toast({
        title: "Login Failed",
        description: err.response?.data?.message || "An error occurred. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  }

  return (
    <div className='flex flex-col justify-center items-center w-[600px]'>
      <h1 className='font-jaini text-4xl  pb-10'>Ulashgram</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-3 items-center w-full'>
        <input
          className=' bg-gray-100 py-1 px-2 border border-gray-300 rounded-md w-1/2'
          type='email'
          placeholder='Enter Email'
          name='email'
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className='relative w-1/2'>
          <input
            className='bg-gray-100 px-2 py-1 border border-gray-300 rounded-md w-full'
            type={showPassword ? 'text' : 'password'}
            placeholder='Enter Password'
            name='password'
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-800 hover:text-gray-400'
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >{showPassword ? 'Hide' : 'Show'}</button>

        </div>
        <button disabled={authLoading} className='bg-blue-500 text-white w-1/2 border-1 rounded-md p-1 hover:bg-blue-600' type='submit'>{authLoading ? 'Logging in ...' : 'Log in'}</button>
      </form>
      <div class="inline flex items-center justify-center">
        <hr class="w-64 h-px my-8 dark:bg-gray-700" />
        <span class="absolute px-3 font-medium text-gray-900  bg-white dark:text-white dark:bg-gray-900">OR</span>
      </div>
      <div className='flex flex-row gap-1'>
        <p>Don't have an account?</p> 
        <Link className='text-blue-600 cursor-pointer hover:text-blue-400' to="/signup">Sign up</Link>
      </div>
    </div>
  )
}

export default Login
