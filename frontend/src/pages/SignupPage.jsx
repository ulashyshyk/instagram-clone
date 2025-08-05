import React from 'react'
import Signup from '../components/Signup'
import Footer from '../components/Footer'

const SignupPage = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <div className='flex-1 flex justify-center items-center px-4 py-8'>
        <Signup />
      </div>
      
      <Footer />
    </div>
  )
}

export default SignupPage
