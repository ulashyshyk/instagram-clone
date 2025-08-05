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
        title: "Missing Information",
        description: "Please enter both email and password.",
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
        title: "Login Successful!",
        description: "Welcome back! Redirecting to your dashboard...",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top"
      });
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (err) {
      console.error("Login Error:", err.response?.data?.message || err.message);
      
      let errorMessage = "An error occurred during login. Please try again.";
      
      if (err.response?.data?.message) {
        const message = err.response.data.message;
        if (message.includes("User not found")) {
          errorMessage = "No account found with this email. Please check your email or create a new account.";
        } else if (message.includes("Incorrect password")) {
          errorMessage = "Incorrect password. Please check your password and try again.";
        } else {
          errorMessage = message;
        }
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  }

  return (
    <div className='flex flex-col justify-center items-center w-full max-w-sm mx-auto px-4'>
      <div className='bg-white border border-gray-300 rounded-lg p-8 w-full max-w-sm'>
        <h1 className='font-jaini text-4xl text-center mb-8'>Ulashgram</h1>
        
        <form onSubmit={handleSubmit} className='space-y-3'>
          <input
            className='w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400'
            type='email'
            placeholder='Enter Email'
            name='email'
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <div className='relative'>
            <input
              className='w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400'
              type={showPassword ? 'text' : 'password'}
              placeholder='Enter Password'
              name='password'
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-blue-900 hover:text-blue-700'
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          
          <button 
            disabled={authLoading} 
            className='w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed' 
            type='submit'
          >
            {authLoading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        
        <div className='relative my-4'>
          <hr className='border-gray-300' />
          <span className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs font-semibold text-gray-500'>
            OR
          </span>
        </div>
        
        <div className='text-center mt-4'>
          <Link className='text-xs text-blue-900 hover:text-blue-700' to="/forgot-password">
            Forgot password?
          </Link>
        </div>
      </div>
      
      <div className='bg-white border border-gray-300 rounded-lg p-4 w-full max-w-sm mt-3'>
        <div className='text-center'>
          <span className='text-sm'>Don't have an account? </span>
          <Link className='text-sm font-semibold text-blue-500 hover:text-blue-400' to="/signup">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
