const Genre = require("../models/genre.model");

module.exports.getGenres = async (req, res) => {
  try {
    const genres = await Genre.find();
    res.status(200).json({ data: genres });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
