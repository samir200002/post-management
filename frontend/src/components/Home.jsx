import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { Edit2, Trash2, Heart, MessageCircle } from "lucide-react"

const Home = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/posts`)
      setPosts(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching posts:", error)
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/posts/${id}`)
      fetchPosts()
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  if (loading) {
    return <div className="text-center text-2xl mt-8">Loading...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <div
          key={post._id}
          className="group bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]"
        >
          <div className="relative h-64 overflow-hidden">
            <img
              src={post.image ? `${API_URL}${post.image}` : "/placeholder.svg"}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div className="p-4">
            <h2 className="font-bold text-xl mb-2 text-gray-800 transition-colors duration-300 group-hover:text-blue-600">
              {post.title}
            </h2>
            <p className="text-gray-600 text-sm mb-4">{post.description}</p>
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button className="text-gray-600 hover:text-pink-500 transition-colors duration-300 transform hover:scale-110">
                  <Heart className="h-6 w-6" />
                </button>
                <button className="text-gray-600 hover:text-blue-500 transition-colors duration-300 transform hover:scale-110">
                  <MessageCircle className="h-6 w-6" />
                </button>
              </div>
              <div className="flex space-x-2">
                <Link
                  to={`/edit/${post._id}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-all duration-300 hover:scale-105"
                >
                  <Edit2 className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-all duration-300 hover:scale-105"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Home