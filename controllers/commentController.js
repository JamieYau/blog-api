const asyncHandler = require("express-async-handler");
const Comment = require("../models/CommentModel");

// Create Comment
const createComment = asyncHandler(async (req, res) => {
  const { post, content, author } = req.body;
  const comment = await Comment.create({ post, content,author });
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
  const updatedComment = await Comment.findByIdAndUpdate(
    id,
    { content },
    { new: true }
  );
  if (!updatedComment) {
    res.status(404).json({ success: false, error: "Comment not found" });
  } else {
    res.status(200).json({ success: true, data: updatedComment });
  }
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
