const asyncHandler = require("express-async-handler");
const Post = require("../models/PostModel");

// Create Post
const createPost = asyncHandler(async (req, res) => {
  const { title, content, published } = req.body;

  // Extract the user ID from the authenticated user's token
  const userId = req.user.userId;

  // Create the post
  try {
    const post = await Post.create({
      title,
      content,
      published,
      authorId: userId,
    });
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get All Posts
const getPosts = asyncHandler(async (req, res) => {
  let posts;

  if (req.user && req.user.isAdmin) {
    // If user is authenticated and is an admin, get all posts
    posts = await Post.find();
  } else {
    // If user is not authenticated or is not an admin, get only published posts
    posts = await Post.find({ published: true });
  }

  res.status(200).json({ success: true, data: posts });
});

// Get Post by ID
// only return published?
// unless the user = author?
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

  // Find the post by ID
  const post = await Post.findById(id);
  if (!post) {
    return res.status(404).json({ success: false, error: "Post not found" });
  }

  // Check if the authenticated user is the author of the post
  if (req.user.userId !== post.authorId.toString()) {
    return res.status(403).json({ success: false, error: "Unauthorized" });
  }

  // Update fields
  if (title !== undefined) {
    post.title = title;
  }
  if (content !== undefined) {
    post.content = content;
  }
  if (published !== undefined) {
    post.published = published;
  }
  post.updatedAt = Date.now();

  // Save the updated post
  try {
    await post.save();
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, error: "Could not update post" });
  }
});


// Delete Post by ID
const deletePostById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find the post by ID
  const post = await Post.findById(id);
  if (!post) {
    return res.status(404).json({ success: false, error: "Post not found" });
  }

  // Check if the authenticated user is the author of the post, or an admin
  if (req.user.userId !== post.authorId.toString() && !req.user.isAdmin) {
    return res.status(403).json({ success: false, error: "Unauthorized" });
  }

  // Delete the post
  await Post.findByIdAndDelete(id);
  res.status(204).end();
});

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePostById,
  deletePostById,
};
