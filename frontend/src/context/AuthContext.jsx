import { createContext, useState, useContext, useEffect } from "react";
import axios from 'axios';
import { useNotification } from "./NotificationContext";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user,setUser] = useState(null)
  const [authLoading,setAuthLoading] = useState(false)
  const [authChecking,setAuthChecking] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setAuthChecking(false);
  }, []);

  const updateUser = (updatedUser) => {
    setUser((prevUser) => {
      const newUser = {...prevUser,...updatedUser}
      localStorage.setItem("user",JSON.stringify(newUser))
      return newUser;
    })
  }
  
  //  Login function
  const login = async (email, password) => {
    try {
      setAuthLoading(true)

      const response = await axios.post(
        "http://localhost:5001/api/auth/login",
        { email, password },
        { withCredentials: true }
      );


      const { accessToken,user } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user)
      setIsAuthenticated(true);
    } catch (error) {
      console.log("Login failed:", error);
      throw error;
    }finally{
      setAuthLoading(false)
    }
  };

  //  Logout function
  const logout = async () => {
    try {
      await axios.post("http://localhost:5001/api/auth/logout", {}, { withCredentials: true });

      localStorage.removeItem("accessToken");
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  //  Refresh token function
  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/refresh",
        {},
        { withCredentials: true }
      );

      const { accessToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      return accessToken;
    } catch (error) {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, refreshAccessToken,user,updateUser,authLoading,authChecking}}>
      {children}
    </AuthContext.Provider>
  );
};