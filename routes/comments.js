const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { authenticateToken } = require("../controllers/authController");
const { body, param } = require("express-validator");
const { handleValidationErrors } = require("../middlewares");

// Create New Comment with validation
router.post(
  "/",
  [
    body("postId").isMongoId().withMessage("Invalid Post ID"),
    body("content")
      .trim()
      .notEmpty()
      .withMessage("Comment content is required"),
  ],
  handleValidationErrors,
  authenticateToken,
  commentController.createComment
);

// Get All Comments
router.get("/", commentController.getComments);

// Get Comment by ID with validation
router.get(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid Comment ID")],
  handleValidationErrors,
  commentController.getCommentById
);

// Update Comment by ID with validation
router.put(
  "/:id",
  [
    param("id").isMongoId().withMessage("Invalid Comment ID"),
    body("content")
      .trim()
      .notEmpty()
      .withMessage("Comment content is required"),
  ],
  handleValidationErrors,
  authenticateToken,
  commentController.updateCommentById
);

// Delete Comment by ID with validation
router.delete(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid Comment ID")],
  handleValidationErrors,
  authenticateToken,
  commentController.deleteCommentById
);

module.exports = router;
