const Book = require("../models/book.model");

module.exports.postBook = async (req, res) => {
  try {
    let { title, author, pub_house, pub_date, genre_id, user_id } = req.body;
    const book = new Book({
      title,
      author,
      pub_house,
      pub_date,
      genre_id,
      user_id,
      image: req.file.filename
    });
    await book.save();
    res.status(201).json({ message: "Book Created Successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getBooks = async (req, res) => {
  try {
    let { user_id } = req.params;
    const books = await Book.find({ user_id });
    res.status(200).json({ data: books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.changeStatus = async (req, res) => {
    try {
        let {status, user_id, book_id} = req.body;
        const book = await Book.findOne({user_id, 'id': book_id});
        book.status = status;
        book.save();
        // res.status(200).json({ 'message': book });
        res.status(200).json({ 'message': 'Status Updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
