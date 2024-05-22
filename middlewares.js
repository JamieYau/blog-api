const { validationResult } = require("express-validator");

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

module.exports = {
  handleValidationErrors,
  isAdminMiddleware,
};
