import mongoose from "mongoose"

const postSchema = mongoose.Schema({
  title: String,
  description: String,
  image: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
})

const Post = mongoose.model("Post", postSchema)

export default Post

