import React,{useEffect, useState} from 'react'
import Sidebar from '../components/Sidebar'
import FeedPostCard from '../components/FeedPostCard'
import Footer from '../components/Footer'
import Spinner from '../components/Spinner'
import axios from 'axios'
const HomePage = () => {
  const [feedPosts,setFeedPosts] = useState([]);
  const [loading,setLoading] = useState(true)

  const fetchFeed = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const config = { headers : {Authorization:`Bearer ${token}`}}

      const response = await axios.get('http://localhost:5001/api/posts/feed',config)
      setFeedPosts(response.data.posts)
    } catch (error) {
      console.error("Failed to load feed:",error)
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeed()
  },[])
  return (
    <div className='relative min-h-screen pb-[65px] md:pb-0 flex overflow-x-hidden'>
      <div className="fixed md:static w-full md:w-[250px] md:h-screen bg-white dark:bg-black shadow md:shadow-none z-50">
        <Sidebar/>
      </div>
        <div className='flex flex-col w-full  p-4  justify-between items-center'>
          {loading ? (
            <div  className='h-[90vh] flex items-center'>
              <Spinner/>
            </div>
          ) : feedPosts.length === 0 ? (
            <div className="text-gray-400 dark:text-gray-500 mt-10 text-sm h-[90vh]">No posts yet. Follow users to see their posts!</div>
          ) : (    
            <div className='flex flex-col gap-10'>
              {feedPosts.map(post => (
                <FeedPostCard key={post._id} post={post} />
              ))}
            </div>
          )
          }
          <Footer />
        </div>
    </div>
  )
}

export default HomePage
