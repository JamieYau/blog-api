const { validationResult } = require("express-validator");
const User = require("./models/UserModel");

// Middleware function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const isAdminMiddleware = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied." });
  }
  next();
};

// Middleware to check if user is admin during login
const isAdminLoginMiddleware = async (req, res, next) => {
  const { username } = req.body;

  // Find the user by username
  const user = await User.findOne({ username });

  // Check if user exists and is an admin
  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: "Access denied." });
  }

  next();
};

module.exports = {
  handleValidationErrors,
  isAdminMiddleware,
  isAdminLoginMiddleware
};