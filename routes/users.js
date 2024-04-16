const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken } = require("../controllers/authController");
const { body, param } = require("express-validator");
const { handleValidationErrors } = require("../middlewares");

// Create New user with validation
router.post(
  "/",
  [
    body("username").trim(),
    body("password")
      .isLength({ min: 8, max: 32 })
      .withMessage("Password must be between 8 and 32 characters"),
  ],
  handleValidationErrors,
  userController.createUser
);

// Get All users
router.get("/", userController.getUsers);

// Get user by ID
router.get(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid User ID")],
  handleValidationErrors,
  userController.getUserById
);

// Update user by ID with validation
router.put(
  "/:id",
  [
    param("id").isMongoId().withMessage("Invalid User ID"),
    body("username").trim(),
  ],
  handleValidationErrors,
  authenticateToken,
  userController.updateUserById
);

// Delete user by ID
router.delete(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid User ID")],
  handleValidationErrors,
  authenticateToken,
  userController.deleteUserById
);

module.exports = router;
