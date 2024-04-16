const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const { handleValidationErrors } = require("../middlewares");

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

module.exports = router;
