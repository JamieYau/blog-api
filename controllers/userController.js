const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");

// Create User
const createUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.create({ username, password });
  res.status(201).json({ success: true, data: user });
});

// Get all Users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json({ success: true, data: users });
});

// Get a User by ID
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select("-password");
  if (!user) {
    res.status(404).json({ success: false, error: "User not found" });
  } else {
    res.status(200).json({ success: true, data: user });
  }
});

// Update User by ID
const updateUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;

  // Find user by Id
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ success: false, error: "User not found" });
  }

  // Check if authenticated user matches id
  if (req.user.userId !== id) {
    return res.status(403).json({ success: false, error: "Unauthorized" });
  }

  // Update user fields
  if (username) {
    user.username = username;
  }
  if (password) {
    user.password = password;
  }

  // Save the updated user
  const updatedUser = await user.save();
  res.status(200).json({ success: true, data: updatedUser });
});

// Delete User by ID
const deleteUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find user by Id
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ success: false, error: "User not found" });
  }
  // Check if authenticated user matches id
  if (req.user.userId !== id) {
    return res.status(403).json({ success: false, error: "Unauthorized" });
  }

  // Delete user
  await User.findByIdAndDelete(id);
  res.status(204).end();
});

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
