const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { authenticateToken } = require("../controllers/authController");
const { body, param } = require("express-validator");
const { handleValidationErrors } = require("../middlewares");

// Create New Post
router.post(
  "/",
  [
    body("title")
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage("Title must be between 3 and 100 characters long"),
    body("content")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Content must be at least 10 characters long"),
  ],
  handleValidationErrors,
  authenticateToken,
  postController.createPost
);


// Get All Posts
router.get("/", postController.getPosts);

// Get Post by ID
router.get(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid Post ID")],
  handleValidationErrors,
  postController.getPostById
);

// Update Post by ID
router.put(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid Post ID")],
  handleValidationErrors,
  authenticateToken,
  postController.updatePostById
);

// Delete Post by ID
router.delete(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid Post ID")],
  handleValidationErrors,
  authenticateToken,
  postController.deletePostById
);

module.exports = router;
