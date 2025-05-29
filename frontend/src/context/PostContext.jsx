import axios from "axios"
import { createContext, useContext, useState } from "react"

const PostContext = createContext()
export const usePost = () => useContext(PostContext)

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState(null)

  const fetchMyPosts = async () => {
    try {
      setLoadingPosts(true)
      const authToken = localStorage.getItem('accessToken')
      if (!authToken) throw new Error("Not authenticated")

      const response = await axios.get("http://localhost:5001/api/posts/post", {
        headers: { Authorization: `Bearer ${authToken}` },
      })

      setPosts(response.data.posts)
    } catch (error) {
      console.error('Fetching my posts failed:', error)
    } finally {
      setLoadingPosts(false)
    }
  }

  const createPost = async (formData) => {
    try {
      setIsCreating(true)
      const authToken = localStorage.getItem("accessToken")
      if (!authToken) throw new Error("Not authenticated")

      const response = await axios.post(
        "http://localhost:5001/api/posts/post",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        }
      )

      if (response.data.post) {
        setPosts(prev => [response.data.post, ...prev])
        return { success: true, post: response.data.post }
      } else {
        return { success: false }
      }
    } catch (error) {
      console.error("Post creation failed:", error)
      return { success: false }
    } finally {
      setIsCreating(false)
    }
  }

  const addComment = async (postId, text) => {
    const token = localStorage.getItem("accessToken")
    const response = await axios.post(
      `http://localhost:5001/api/posts/comment/${postId}`,
      { text },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data.post
  }

  const deleteComment = async (postId, commentId) => {
    const token = localStorage.getItem('accessToken')
    const response = await axios.delete(
      `http://localhost:5001/api/posts/comment/${postId}/${commentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data.post
  }

  const removePost = (postId) => {
    setPosts((prev) => prev.filter((post) => post._id !== postId))
  }

  const toggleLike = async (postId) => {
    const token = localStorage.getItem('accessToken')
    const response = await axios.put(
      `http://localhost:5001/api/posts/like/${postId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data.post
  }

  return (
    <PostContext.Provider
      value={{
        posts,
        setPosts,
        createPost,
        fetchMyPosts,
        loading,
        isCreating,
        loadingPosts,
        addComment,
        deleteComment,
        removePost,
        toggleLike,
        selectedPostId,
        setSelectedPostId,
      }}
    >
      {children}
    </PostContext.Provider>
  )
}
