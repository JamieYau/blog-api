const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");

// Create User
const createUser = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;
  const user = await User.create({ username, password });
  res.status(201).json({ success: true, data: user });
});

// Get all Users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json({ success: true, data: users });
});

// Get a User by ID
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
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
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { username, password },
    { new: true }
  );
  if (!updatedUser) {
    res.status(404).json({ success: false, error: "User not found" });
  } else {
    res.status(200).json({ success: true, data: updatedUser });
  }
});

// Delete User by ID
const deleteUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    res.status(404).json({ success: false, error: "User not found" });
  } else {
    res.status(204).end();
  }
});

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
