const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: [3, "Title must be at least 3 characters long"],
    maxlength: [100, "Title cannot exceed 100 characters"],
  },
  content: {
    type: String,
    required: true,
    minlength: [10, "Content must be at least 10 characters long"],
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  published: {
    type: Boolean,
    default: false,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", postSchema);
