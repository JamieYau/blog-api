const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");
const { JWT_SECRET, JWT_REFRESH_SECRET, NODE_ENV } = process.env;
const ACCESSEXPIRY = "15m";
const REFRESHEXPIRY = "7d";

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, username: user.username, isAdmin: user.isAdmin },
    JWT_SECRET,
    {
      expiresIn: ACCESSEXPIRY,
    }
  );
  const refreshToken = jwt.sign(
    { userId: user._id, username: user.username, isAdmin: user.isAdmin },
    JWT_REFRESH_SECRET,
    {
      expiresIn: REFRESHEXPIRY,
    }
  );
  return { accessToken, refreshToken };
};

// User login
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Find the user by username
  const user = await User.findOne({ username });

  // Check user credentials
  if (!user || !(await user.validatePassword(password))) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  // Generate JWT and Refresh tokens
  const { accessToken, refreshToken } = generateTokens(user);
  // Assigning refresh accessToken in http-only cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: NODE_ENV === "production", // only send cookie over https in production
    sameSite: "none",
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res
    .status(200)
    .json({
      success: true,
      accessToken,
      userId: user._id,
      isAdmin: user.isAdmin,
    });
});

// Middleware function to authenticate JWT accessToken
const authenticateToken = (req, res, next) => {
  // Get the accessToken from the Authorization header
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];

  if (!accessToken) {
    // If accessToken is not provided, return 401 Unauthorized
    return res.sendStatus(401);
  }
  // Verify the accessToken
  jwt.verify(accessToken, JWT_SECRET, (err, user) => {
    if (err) {
      // If accessToken is invalid, return 403 Forbidden
      return res.sendStatus(403);
    }
    // Attach the authenticated user to the request object
    req.user = user;
    next(); // Call the next middleware
  });
};

// Middleware function for optional accessToken authentication
const authenticateTokenOptional = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];

  if (!accessToken) {
    return next(); // Proceed without attaching user
  }

  jwt.verify(accessToken, JWT_SECRET, (err, user) => {
    if (err) {
      return next(); // Proceed without attaching user
    }

    req.user = user; // Attach user to request object
    next();
  });
};

const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not found" });
  }

  try {
    const user = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const newAccessToken = jwt.sign(
      { userId: user.userId, username: user.username, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: ACCESSEXPIRY }
    );
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.log("Invalid refresh token", err);
    return res.status(403).json({ message: "Invalid refresh token" });
  }
});

module.exports = {
  login,
  authenticateToken,
  authenticateTokenOptional,
  refreshToken,
};
