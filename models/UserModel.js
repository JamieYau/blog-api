const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must be at least 8 characters long"],
    maxlength: [32, "Password cannot exceed 32 characters"],
  },
});

// Schema method to validate user password
userSchema.methods.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Middleware to hash password before saving
userSchema.pre("save", async function (next) {
  // Only hash the password if it's modified or new
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Hash the password with bcrypt
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("User", userSchema);
