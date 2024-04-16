const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");
const { JWT_SECRET } = process.env;

// User login
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Find the user by username
  const user = await User.findOne({ username });

  // Check if user exists
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid username" });
  }

  // Validate the password
  const isValidPassword = await user.validatePassword(password);
  if (!isValidPassword) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid username or password" });
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id, username: user.username },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({ success: true, token });
});

// Middleware function to authenticate JWT token
const authenticateToken = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    // If token is not provided, return 401 Unauthorized
    return res.sendStatus(401);
  }

  // Verify the token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // If token is invalid, return 403 Forbidden
      return res.sendStatus(403);
    }

    // Attach the authenticated user to the request object
    req.user = user;
    next(); // Call the next middleware
  });
};

module.exports = {
  login,
  authenticateToken,
};
