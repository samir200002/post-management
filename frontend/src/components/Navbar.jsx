import { Link } from "react-router-dom"
import { Home, PlusSquare, Instagram } from "lucide-react"

const Navbar = () => {
  const API_URL = import.meta.env.VITE_API_URL

  return (
    <nav className="bg-white shadow-lg w-full fixed top-0 left-0 z-50" style={{ "--navbar-height": "4rem" }}>
      <div className="px-6 flex justify-between items-center" style={{ height: "var(--navbar-height)" }}>
        <Link to="/" className="flex items-center space-x-2">
          <Instagram className="h-8 w-8 text-pink-500" />
          <span className="font-semibold text-xl text-gray-800">Instagram Post</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="flex items-center space-x-1 text-gray-700 hover:text-pink-500 transition duration-300"
          >
            <Home className="h-5 w-5" />
            <span className="hidden md:inline">Home</span>
          </Link>
          <Link
            to="/create"
            className="flex items-center space-x-1 bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition duration-300"
          >
            <PlusSquare className="h-5 w-5" />
            <span className="hidden md:inline">Create Post</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

