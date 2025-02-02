import { createContext, useState, useEffect, useCallback } from "react"
import axios from "axios"

export const PostContext = createContext()

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([])
  const API_URL = import.meta.env.VITE_API_URL

  const fetchPosts = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/posts`) 
      setPosts(response.data)
    } catch (error) {
      console.error("Error fetching posts:", error)
    }
  }, [API_URL])


  useEffect(() => {
    fetchPosts()
  }, [fetchPosts]) // Added fetchPosts to the dependency array

  return <PostContext.Provider value={{ posts, setPosts, fetchPosts }}>{children}</PostContext.Provider>
}

