import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { Edit2, ImageIcon } from "lucide-react"

const EditPost = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState(null)
  const [currentImage, setCurrentImage] = useState("")
  const [imagePreview, setImagePreview] = useState("")
  const [fileName, setFileName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { id } = useParams()
  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/posts/${id}`)
        setTitle(res.data.title)
        setDescription(res.data.description)
        setCurrentImage(res.data.image)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching post:", error)
        setError("Failed to load post. Please try again.")
        setLoading(false)
      }
    }
    fetchPost()
  }, [id, API_URL])

  const handleImageChange = (e) => {
    const file = e.target.files ? e.target.files[0] : null
    if (file) {
      setImage(file)
      setFileName(file.name)
      // Create URL for image preview
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
      
      // Cleanup previous preview URL
      return () => URL.revokeObjectURL(previewUrl)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)
    if (image) {
      formData.append("image", image)
    } else if (currentImage) {
      formData.append("currentImage", currentImage)
    }

    try {
      await axios.patch(`${API_URL}/api/posts/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      navigate("/")
    } catch (error) {
      console.error("Error updating post:", error)
      setError("An error occurred while updating the post. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center text-2xl mt-8">Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Post</h2>
          {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                Title
              </label>
              <input
                className="shadow-sm appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                id="title"
                type="text"
                placeholder="Enter post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                className="shadow-sm appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                id="description"
                placeholder="Enter post description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                Image
              </label>
              <div className="mb-4">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md"
                  />
                ) : currentImage ? (
                  <img
                    src={`${API_URL}${currentImage}`}
                    alt="Current"
                    className="w-full h-48 object-cover rounded-md"
                  />
                ) : null}
              </div>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="image"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload a new file</span>
                      <input
                        id="image"
                        name="image"
                        type="file"
                        className="sr-only"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
              {fileName && <p className="mt-2 text-sm text-gray-600">Selected file: {fileName}</p>}
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 text-right">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300 flex items-center justify-center"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              "Updating..."
            ) : (
              <>
                <Edit2 className="h-4 w-4 mr-2" />
                Update Post
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditPost