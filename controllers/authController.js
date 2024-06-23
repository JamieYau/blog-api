const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");
const { JWT_SECRET } = process.env;
const { JWT_REFRESH_SECRET } = process.env;

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, username: user.username, isAdmin: user.isAdmin },
    JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
  const refreshToken = jwt.sign(
    { userId: user._id, username: user.username, isAdmin: user.isAdmin },
    JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );
  return { accessToken, refreshToken };
};

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

  // Generate JWT and Refresh tokens
  const { accessToken, refreshToken } = generateTokens(user);
  // Assigning refresh token in http-only cookie
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ success: true, accessToken });
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

// Middleware function for optional token authentication
const authenticateTokenOptional = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next(); // Proceed without attaching user
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return next(); // Proceed without attaching user
    }

    req.user = user; // Attach user to request object
    next();
  });
};

const refreshToken = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = jwt.sign(
      { userId: user.userId },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    res.json({ accessToken });
    next;
  });
};

module.exports = {
  login,
  authenticateToken,
  authenticateTokenOptional,
  refreshToken
};
