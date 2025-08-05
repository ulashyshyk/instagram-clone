import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '@chakra-ui/react';

const Signup = () => {
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { register, authLoading } = useAuth();
  const toast = useToast();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password || !username) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    
    try {
      await register(username, email, password);
      
      toast({
        title: "Registration Successful!",
        description: "Welcome to Ulashgram! Redirecting to your dashboard...",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("Registration Error:", err.response?.data?.message || err.message);
      
      let errorMessage = "An error occurred during registration. Please try again.";
      
      if (err.response?.data?.message) {
        const message = err.response.data.message;
        if (message.includes("Email already exists")) {
          errorMessage = "This email is already registered. Please use a different email or try logging in.";
        } else if (message.includes("Username already exists")) {
          errorMessage = "This username is already taken. Please choose a different username.";
        } else if (message.includes("All fields are required")) {
          errorMessage = "Please fill in all required fields.";
        } else {
          errorMessage = message;
        }
      }
      
      toast({
        title: "Registration Failed",
        description: errorMessage,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full max-w-sm mx-auto px-4">
      <div className="bg-white border border-gray-300 rounded-lg p-8 w-full max-w-sm">
        <h1 className="font-jaini text-4xl text-center mb-8">Ulashgram</h1>
        <p className="text-center text-sm text-gray-600 mb-6">
          Sign up to see photos and videos from your friends.
        </p>
        
        <div className="relative mb-6">
          <hr className="border-gray-300" />
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs font-semibold text-gray-500">
            OR
          </span>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400"
            type="email"
            placeholder="Enter Email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <input
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400"
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-blue-900 hover:text-blue-700"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          
          <input
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400"
            placeholder="Username"
            name="username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          
          <p className="text-center text-xs text-gray-600 mt-4">
            People who use our service may have uploaded your contact
            information to Instagram.{" "}
            <a
              className="text-blue-800 hover:text-blue-600"
              href="https://www.facebook.com/help/instagram/261704639352628"
            >
              Learn More
            </a>
          </p>
          
          <p className="text-center text-xs text-gray-600 mt-2">
            By signing up, you agree to our{" "}
            <a
              className="text-blue-800 hover:text-blue-600"
              href="https://help.instagram.com/581066165581870/?locale=en_US"
            >
              Terms
            </a>{" "}
            ,
            <a
              className="text-blue-800 hover:text-blue-600"
              href="https://www.facebook.com/privacy/policy"
            >
              {" "}
              Privacy Policy
            </a>
            ,
            <a
              className="text-blue-800 hover:text-blue-600"
              href="https://privacycenter.instagram.com/policies/cookies/"
            >
              {" "}
              Cookies Policy
            </a>
            .
          </p>
          
          <button
            disabled={authLoading}
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            type="submit"
          >
            {authLoading ? "Creating account..." : "Sign up"}
          </button>
        </form>
      </div>

      <div className="bg-white border border-gray-300 rounded-lg p-4 w-full max-w-sm mt-3">
        <div className="text-center">
          <span className="text-sm">Have an account? </span>
          <Link
            className="text-sm font-semibold text-blue-500 hover:text-blue-400"
            to="/login"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
