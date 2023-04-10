const express = require("express");
const app = express();
const userRouter = require("./routes/user.route");
const bookRouter = require("./routes/book.route");
const genreRouter = require("./routes/genre.roue");
const connectDB = require("./config/db.config");
const createError = require("http-errors");
const cors = require("cors");
require("dotenv").config();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/auth", userRouter);
app.use("/api", bookRouter);
app.use("/api", genreRouter);

app.use((req, res, next) => {
  next(createError(404, "Not Found Page"));
});

// Define your upload route
app.post('/upload', (req, res) => {
  if (!req.file) {
    return res.json({'error': 'Please upload a file'});
  }
  res.status(200).json({ message: 'File uploaded successfully' });
});

app.listen(9000, () => {
  console.log("Server Listen on port 9000");
});
