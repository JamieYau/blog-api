const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { authenticateToken} = require("../controllers/authController")

// Create New Comment
router.post("/", authenticateToken, commentController.createComment);

// Get All Comments
router.get("/", commentController.getComments);

// Get Comment by ID
router.get("/:id", commentController.getCommentById);

// Update Comment by ID
router.put("/:id", commentController.updateCommentById);

// Delete Comment by ID
router.delete("/:id", commentController.deleteCommentById);

module.exports = router;
