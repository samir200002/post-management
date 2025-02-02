import mongoose from "mongoose"
import Post from "../models/post.js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

// Workaround for __dirname in ES Modules
const __dirname = dirname(fileURLToPath(import.meta.url))

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getPosts:", error);
    res.status(500).json({ message: "Error fetching posts", error: error.message });
  }
}

// Add this new controller
export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Invalid post ID format" });
    }

    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error in getPost:", error);
    res.status(500).json({ message: "Error fetching post", error: error.message });
  }
}

export const createPost = async (req, res) => {
  const { title, description } = req.body;
  let imagePath = null;

  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`;
  }

  const newPost = new Post({
    title,
    description,
    image: imagePath,
    createdAt: new Date()
  });

  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error in createPost:", error);
    if (imagePath) {
      fs.unlink(join(__dirname, "..", "uploads", req.file.filename), (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }
    res.status(500).json({ message: "Error creating post", error: error.message });
  }
}

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Invalid post ID format" });
  }

  try {
    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    let imagePath = post.image;

    if (req.file) {
      // Delete old image if exists
      if (post.image) {
        const oldImagePath = join(__dirname, "..", path.basename(post.image));
        fs.unlink(oldImagePath, (err) => {
          if (err && err.code !== 'ENOENT') console.error("Error deleting old image:", err);
        });
      }
      imagePath = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      imagePath = req.body.image;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        title,
        description,
        image: imagePath,
      },
      { new: true }
    );

    res.json(updatedPost);
  } catch (error) {
    console.error("Error in updatePost:", error);
    if (req.file) {
      fs.unlink(join(__dirname, "..", "uploads", req.file.filename), (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }
    res.status(500).json({ message: "Error updating post", error: error.message });
  }
}

export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Invalid post ID format" });
  }

  try {
    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.image) {
      const imagePath = join(__dirname, "..", path.basename(post.image));
      fs.unlink(imagePath, (err) => {
        if (err && err.code !== 'ENOENT') {
          console.error("Error deleting image file:", err);
        } else {
          console.log("Image file deleted successfully.");
        }
      });
    }

    await Post.findByIdAndDelete(id);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error in deletePost:", error);
    res.status(500).json({ message: "Error deleting post", error: error.message });
  }
}