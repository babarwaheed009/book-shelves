const mongoose = require("mongoose");
const autoIncrement = require("mongoose-plugin-autoinc");
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  user_id: {
    type: Number,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  pub_house: {
    type: String,
    required: true,
  },
  pub_date: {
    type: Date,
    required: true,
  },
  genre_id: {
    type: Number,
    required: true,
  },
  status: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    required: true
  }
});
bookSchema.plugin(autoIncrement.plugin, {
  model: "Book",
  field: "id",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model("Book", bookSchema);
