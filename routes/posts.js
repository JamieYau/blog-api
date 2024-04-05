const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

// Create New Post
router.post("/", postController.createPost);

// Get All Posts
router.get("/", postController.getPosts);

// Get Post by ID
router.get("/:id", postController.getPostById);

// Update Post by ID
router.put("/:id", postController.updatePostById);

// Delete Post by ID
router.delete("/:id", postController.deletePostById);

module.exports = router;
