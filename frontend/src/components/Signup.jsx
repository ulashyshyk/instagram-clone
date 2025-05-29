import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import * as Chakra from "@chakra-ui/react";
const { useToast } = Chakra;
const Signup = () => {
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(
        "http://localhost:5001/api/auth/register",
        { username, email, password }
      );
      console.log("Response: ", result);
      toast({
        title: "Registration Successful",
        description: "Redirecting to login page...",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(
        "ERROR message: ",
        err.message,
        " ERROR RESPONSE: ",
        err.response?.data
      );
      toast({
        title: "Login Failed",
        description:
          err.response?.data?.message || "An error occurred. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-[100vh]">
      <div className="flex flex-col items-center border-2 border-gray-200 rounded-md h-[80vh] w-[300px] md:w-[330px]">
        <h1 className="font-jaini text-4xl  pb-10 mx-auto p-2">Ulashgram</h1>
        <p className="text-center text-sm w-[80%]">
          Sign up to see photos and videos from your friends.
        </p>
        <div class="inline flex items-center justify-center">
          <hr class="w-64 h-px my-8 dark:bg-gray-700" />
          <span class="absolute p-3 font-medium text-gray-900  bg-white dark:text-white dark:bg-gray-900">
            OR
          </span>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 items-center w-[80%] "
        >
          <input
            className="bg-gray-100 px-2 py-1 border border-gray-300 rounded-md w-[90%] "
            type="email"
            placeholder="Enter Email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative w-[90%]">
            <input
              className="bg-gray-100 px-2 py-1 border border-gray-300 rounded-md w-full"
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-800 hover:text-gray-400"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <input
            className="bg-gray-100 px-2 py-1 border border-gray-300 rounded-md w-[90%]"
            placeholder="Enter Username"
            name="username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <p className="text-center text-xs pt-4">
            People who use our service may have uploaded your contact
            information to Instagram.{" "}
            <a
              className="text-blue-800 hover:text-blue-600"
              href="https://www.facebook.com/help/instagram/261704639352628"
            >
              Learn More
            </a>
          </p>
          <p className="text-center text-xs p-2">
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
            className="bg-blue-500 text-white w-1/2 border-1 rounded-md p-1 hover:bg-blue-600 w-[90%]"
            type="submit"
          >
            Sign up
          </button>
        </form>
      </div>

      <div className="flex flex-col items-center border-2 border-gray-200 rounded-md h-[10vh] w-[300px] md:w-[330px] mt-3">
        <p className="text-sm mt-3">Have an account?</p>
        <Link
          className="text-blue-600 cursor-pointer hover:text-blue-400 text-sm"
          to="/login"
        >
          Log in
        </Link>
      </div>
    </div>
  );
};

export default Signup;
