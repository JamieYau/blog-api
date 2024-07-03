const dotenv = require("dotenv");
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

dotenv.config();
const { DB_URI, NODE_ENV } = process.env;

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");
const authRouter = require("./routes/auth");

const app = express();

// connect to database
mongoose
  .connect(DB_URI)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log(err));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

if (NODE_ENV === "development") {
  const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174"], // Frontend origin
    credentials: true, // Enable cookies to be sent
  };
  app.use(cors(corsOptions));
}

if (NODE_ENV === "production") {
  const corsOptions = {
    origin: ["https://blog.jamieyau.com", "https://blog-cms.jamieyau.com"], // Frontend origin
    credentials: true, // Enable cookies to be sent
  };
  app.use(cors(corsOptions));
}

app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/auth", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
