const asyncHandler = require("express-async-handler");
const Comment = require("../models/CommentModel");
const Post = require("../models/PostModel");

// Create Comment
const createComment = asyncHandler(async (req, res) => {
  const { postId, content } = req.body;

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
  const comment = await Comment.create({
    postId,
    content,
    authorId: userId,
  });
  res.status(201).json({ success: true, data: comment });
});

// Get All Comments
const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find();
  res.status(200).json({ success: true, data: comments });
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
  // Update comment
  const updatedComment = await Comment.findByIdAndUpdate(
    id,
    { content, updateAt: Date.now() },
    { new: true }
  );
  res.status(200).json({ success: true, data: updatedComment });
});

// Delete Comment by ID
const deleteCommentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const comment = await Comment.findByIdAndDelete(id);
  if (!comment) {
    res.status(404).json({ success: false, error: "Comment not found" });
  } else {
    res.status(204).end();
  }
});

module.exports = {
  createComment,
  getComments,
  getCommentById,
  updateCommentById,
  deleteCommentById,
};
