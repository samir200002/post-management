import express from "express"
import { getPosts, getPost, createPost, updatePost, deletePost } from "../controllers/posts.js"
import { upload } from "../middleware/upload.js"

const router = express.Router()

// Get all posts
router.get("/", getPosts)

// Get single post by ID
router.get("/:id", getPost)

// Create new post
router.post("/", upload.single("image"), createPost)

// Update existing post
router.patch("/:id", upload.single("image"), updatePost)

// Delete post
router.delete("/:id", deletePost)

export default router