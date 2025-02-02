import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./components/Home"
import CreatePost from "./components/CreatePost"
import EditPost from "./components/EditPost"
import { PostProvider } from "./context/PostContext"

function App() {
  return (
    <PostProvider>
      <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/edit/:id" element={<EditPost />} />
          </Routes>
        </main>
      </div>
    </Router>
    </PostProvider>
  )
}

export default App

