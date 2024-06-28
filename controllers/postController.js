const asyncHandler = require("express-async-handler");
const Post = require("../models/PostModel");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create Post
const createPost = asyncHandler(async (req, res) => {
  const { title, content, published, tags } = req.body;
  let coverImageUrl = "";

  // Extract the user ID from the authenticated user's token
  const userId = req.user.userId;

  // Handle cover image upload
  if (req.file) {
    try {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "image", folder: "blog_covers" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        stream.end(req.file.buffer);
      });

      coverImageUrl = uploadResult.secure_url;
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: "Image upload failed" });
    }
  }

  // Create the post
  try {
    const post = await Post.create({
      title,
      content,
      published,
      authorId: userId,
      coverImageUrl,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
    });
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get Posts
const getPosts = asyncHandler(async (req, res) => {
  const { authorId, searchTerm } = req.query;
  const isAdmin = req.user && req.user.isAdmin;
  const sortDirection = req.query.order === "asc" ? 1 : -1;

  // initial query based on admin status
  const postsQuery = isAdmin ? {} : { published: true };

  // Use spread operator to append optional queries to postsQuery
  const optionalQueries = {
    ...(authorId && { authorId: authorId }),
    ...(searchTerm && {
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { content: { $regex: searchTerm, $options: "i" } },
        { tags: { $regex: searchTerm, $options: "i" } },
      ],
    }),
  };

  // Merge optional queries into main query object
  const mergedQuery = { ...postsQuery, ...optionalQueries };

  const posts = await Post.find(mergedQuery).sort({ updatedAt: sortDirection });

  res.status(200).json({
    success: true,
    data: posts,
  });
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
  const { title, content, published, tags } = req.body;
  let coverImageUrl;

  // Find the post by ID
  const post = await Post.findById(id);
  if (!post) {
    return res.status(404).json({ success: false, error: "Post not found" });
  }

  // Check if the authenticated user is the author of the post
  if (req.user.userId !== post.authorId.toString()) {
    return res.status(403).json({ success: false, error: "Unauthorized" });
  }

  // Handle cover image upload
  if (req.file) {
    try {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "image", folder: "blog_covers" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        stream.end(req.file.buffer);
      });

      coverImageUrl = uploadResult.secure_url;
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: "Image upload failed" });
    }
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
  if (coverImageUrl) {
    post.coverImageUrl = coverImageUrl;
  }
  if (tags !== undefined) {
    post.tags = tags.split(",").map((tag) => tag.trim());
  }

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

// Like Post by ID
const toggleLikeById = asyncHandler(async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    const likeIndex = post.likes.indexOf(userId);
    if (likeIndex === -1) {
      // User hasn't liked the post yet, so add their like
      post.likes.push(userId);
    } else {
      // User has already liked the post, so remove their like
      post.likes.splice(likeIndex, 1);
    }
    await post.save();
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePostById,
  deletePostById,
  toggleLikeById,
  searchPosts,
};
