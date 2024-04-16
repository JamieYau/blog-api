const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken } = require("../controllers/authController");
const { body } = require("express-validator");

// Create New user with validation
router.post(
  "/",
  [
    body("username").trim(),
    body("password")
      .isLength({ min: 8, max: 32 })
      .withMessage("Password must be between 8 and 32 characters"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  userController.createUser
);

// Get All users
router.get("/", userController.getUsers);

// Get user by ID
router.get("/:id", userController.getUserById);

// Update user by ID with validation
router.put(
  "/:id",
  [body("username").trim()],
  authenticateToken,
  userController.updateUserById
);

// Delete user by ID
router.delete("/:id", authenticateToken, userController.deleteUserById);

module.exports = router;
