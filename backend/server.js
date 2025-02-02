import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"
import postRoutes from "./routes/posts.js"

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// CORS configuration
const corsOptions = {
  origin: "https://post-management-eight.vercel.app/", // Vite's default port
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400 // 24 hours
}

app.use(cors(corsOptions))
app.use(express.json())

// Create 'uploads' directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Serve uploaded files
app.use("/uploads", express.static(uploadsDir))

app.use("/api/posts", postRoutes)

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong!", error: err.message })
})

const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
  .catch((error) => console.log("Error connecting to MongoDB:", error.message))