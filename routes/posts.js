const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { authenticateToken } = require("../controllers/authController");

// Create New Post
router.post("/", authenticateToken, postController.createPost);

// Get All Posts
router.get("/", postController.getPosts);

// Get Post by ID
router.get("/:id", postController.getPostById);

// Update Post by ID
router.put("/:id", authenticateToken, postController.updatePostById);

// Delete Post by ID
router.delete("/:id", authenticateToken, postController.deletePostById);

module.exports = router;
