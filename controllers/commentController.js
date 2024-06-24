const asyncHandler = require("express-async-handler");
const Comment = require("../models/CommentModel");
const Post = require("../models/PostModel");

// Create Comment
const createComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  // Check if the post exists
  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ success: false, error: "Post not found" });
  }

  // Check if the post is published
  if (!post.published) {
    return res
      .status(403)
      .json({ success: false, error: "Cannot comment on unpublished posts" });
  }

  // Extract the user ID from the authenticated user's token
  const userId = req.user.userId;

  // Create comment
  try {
    const comment = await Comment.create({
      postId,
      content,
      authorId: userId,
    });
    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get All Comments
const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find();
  res.status(200).json({ success: true, data: comments });
});

// Get Comments by postId
const getCommentsByPostId = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  try {
    // Fetch comments related to the specified post
    const comments = await Comment.find({ postId });
    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Get Comment by ID
const getCommentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const comment = await Comment.findById(id);
  if (!comment) {
    res.status(404).json({ success: false, error: "Comment not found" });
  } else {
    res.status(200).json({ success: true, data: comment });
  }
});

// Update Comment by ID
const updateCommentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  // Check if the comment exists
  const comment = await Comment.findById(id);
  if (!comment) {
    res.status(404).json({ success: false, error: "Comment not found" });
  }

  // Check if the authenticated user is the author of the comment
  const userId = req.user.userId;
  if (userId !== comment.authorId.toString()) {
    res.status(403).json({ success: false, error: "Unauthorized" });
  }

  // Update fields
  comment.content = content;
  comment.updatedAt = Date.now();

  // Save the Updated comment
  try {
    await comment.save();
    res.status(200).json({ success: true, data: comment });
  } catch (error) {
    res.status(400).json({ success: false, error: "Could not update comment" });
  }
});

// Delete Comment by ID
const deleteCommentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // Check if the comment exists
  const comment = await Comment.findById(id);
  if (!comment) {
    res.status(404).json({ success: false, error: "Comment not found" });
  }

  // Check if the authenticated user is the author of the post
  const userId = req.user.userId;
  if (userId !== comment.authorId.toString()) {
    return res.status(403).json({ success: false, error: "Unauthorized" });
  }

  // Delete comment
  await Comment.findByIdAndDelete(id);
  res.status(204).end();
});

module.exports = {
  createComment,
  getComments,
  getCommentsByPostId,
  getCommentById,
  updateCommentById,
  deleteCommentById,
};
