const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Create New user
router.post("/", userController.createUser);

// Get All users
router.get("/", userController.getUsers);

// Get user by ID
router.get("/:id", userController.getUserById);

// Update user by ID
router.put("/:id", userController.updateUserById);

// Delete user by ID
router.delete("/:id", userController.deleteUserById);

module.exports = router;
