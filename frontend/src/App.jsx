import { useEffect } from 'react'
import AuthPage from './pages/AuthPage'
import { Route,Routes,useLocation,useNavigate } from 'react-router-dom'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext.jsx'
import ProfilePage from './pages/ProfilePage'
import EditProfile from './pages/EditProfile'
import PublicProfilePage from './pages/PublicProfilePage.jsx'
import axios from 'axios'
import MessagesPage from './pages/MessagesPage.jsx'
import {Toaster} from 'react-hot-toast'
function App() {
  const { isAuthenticated, logout,authChecking } = useAuth()
  const navigate = useNavigate()
  const location = useLocation();

  useEffect(() => {
    const checkToken = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        logout();
        return;
      }

      const decodeToken = (token) => {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload.exp * 1000 < Date.now(); // Check expiration
        } catch (error) {
          console.error("Invalid token format:", error);
          return true; // Treat as expired if decoding fails
        }
      };

      if (decodeToken(accessToken)) {
        try {
          // Call refresh token route if the token is expired
          const result = await axios.post(
            'http://localhost:5001/api/auth/refresh',
            {},
            { withCredentials: true }
          );
          const { accessToken: newAccessToken } = result.data;
          localStorage.setItem('accessToken', newAccessToken);
        } catch (error) {
          console.error("Token refresh failed:", error);
          logout();
        }
      }
    };

    checkToken();
  }, [isAuthenticated, logout]);

  useEffect(() => {
    if (isAuthenticated && location.pathname === "/login") {
      navigate("/");
    }
  }, [isAuthenticated, location, navigate]);

  if (authChecking) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white dark:bg-black flex items-center justify-center">
        <span className="text-gray-600 dark:text-gray-300 animate-pulse text-sm">Loading...</span>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Toaster position='top-center' reverseOrder={false}/>

      <Routes location={location}>
        <Route path='/login' element={<AuthPage />}/> 
        <Route path='/signup' element={<SignupPage />}/>
      
        {/* Protected Routes */}

        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<HomePage />} />
          <Route path='profile' element={<ProfilePage />}/>
          <Route path='profile/:username' element={<PublicProfilePage />} />
          <Route path='/edit-profile' element={<EditProfile />}/>
          <Route path='/messages' element={<MessagesPage />} />
        </Route>  
      </Routes>
    </div>
  )
}

export default App
