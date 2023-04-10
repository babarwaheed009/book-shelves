const express = require("express");
const validateRequest = require("../middleware/validation.middleware");
const auth = require("../middleware/auth.middleware");
const { postBook, getBooks, changeStatus } = require("../controllers/book.controller");
const { bookSchema, bookStatusSchema } = require("../schema/book.schema");
const app = express();

const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../..', 'client', 'public', 'images'),
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Generate unique file name
  }
});

const fileFilter = function(req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error('Only JPEG and PNG images are allowed');
      error.code = 'LIMIT_FILE_TYPES';
      return cb(error, false);
    }
    return cb(null, true);
  };

const upload = multer({ storage: storage, fileFilter });

app.post("/book", upload.single('book_img'), postBook);
app.get("/books/:user_id", auth, getBooks);
app.post("/book/change-status", [auth, validateRequest(bookStatusSchema)], changeStatus);

module.exports = app;
