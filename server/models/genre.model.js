const mongoose = require("mongoose");
const autoIncrement = require("mongoose-plugin-autoinc");
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});
genreSchema.plugin(autoIncrement.plugin, {
  model: "Genre",
  field: "id",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model("Genre", genreSchema);
