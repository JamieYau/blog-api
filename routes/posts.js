const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");
const { authenticateToken, authenticateTokenOptional } = require("../controllers/authController");
const { body, param } = require("express-validator");
const sanitizeHtml = require("sanitize-html")
const { handleValidationErrors, isAdminMiddleware } = require("../middlewares");

const htmlSanitizer = (value) => {
  return sanitizeHtml(value);
};

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
  isAdminMiddleware,
  postController.createPost
);

// Get All Posts
router.get("/", authenticateTokenOptional, postController.getPosts);

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
  isAdminMiddleware,
  postController.updatePostById
);

// Delete Post by ID
router.delete(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid Post ID")],
  handleValidationErrors,
  authenticateToken,
  isAdminMiddleware,
  postController.deletePostById
);

// Create New Comment with validation
router.post(
  "/:postId/comments",
  [
    body("content")
      .trim()
      .notEmpty()
      .withMessage("Comment content is required"),
  ],
  handleValidationErrors,
  authenticateToken,
  commentController.createComment
);

// Get comments related to post
router.get("/:postId/comments", commentController.getCommentsByPostId);

module.exports = router;
