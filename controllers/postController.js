const asyncHandler = require("express-async-handler");
const Post = require("../models/PostModel");

// Create Post
const createPost = asyncHandler(async (req, res) => {
  const { title, content, published, author } = req.body;
  const post = await Post.create({ title, content, published, author });
  res.status(201).json({ success: true, data: post });
});

// Get All Posts
const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find();
  res.status(200).json({ success: true, data: posts });
});

// Get Post by ID
const getPostById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) {
    res.status(404).json({ success: false, error: "Post not found" });
  } else {
    res.status(200).json({ success: true, data: post });
  }
});

// Update Post by ID
const updatePostById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, published } = req.body;
  const updatedPost = await Post.findByIdAndUpdate(
    id,
    { title, content, published }, // Update the published field as well
    { new: true }
  );
  if (!updatedPost) {
    res.status(404).json({ success: false, error: "Post not found" });
  } else {
    res.status(200).json({ success: true, data: updatedPost });
  }
});

// Delete Post by ID
const deletePostById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findByIdAndDelete(id);
  if (!post) {
    res.status(404).json({ success: false, error: "Post not found" });
  } else {
    res.status(204).end();
  }
});

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePostById,
  deletePostById,
};
