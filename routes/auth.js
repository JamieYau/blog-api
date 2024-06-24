const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const { handleValidationErrors, isAdminLoginMiddleware,  } = require("../middlewares");

// Login route with validation
router.post(
  "/login",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  handleValidationErrors,
  authController.login
);

// CMS login with admin check
router.post(
  "/login-cms",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  handleValidationErrors,
  isAdminLoginMiddleware,
  authController.login
);

router.post("/refresh-token", authController.refreshToken)

module.exports = router;
