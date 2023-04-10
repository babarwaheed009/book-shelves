const Genre = require("../models/genre.model");
const connectDB = require("../config/db.config");
const mongoose = require("mongoose");
connectDB();
const seedGenres = async () => {
  try {
    // Remove all existing genres
    await Genre.deleteMany();
    const data = [
      { name: "Horror" },
      { name: "Comedy" },
      { name: "Fiction" },
      { name: "Non-Fiction" },
    ];
    // Insert the seed data
    await Genre.insertMany(data);
    console.log("Genres seeded successfully!");
    await mongoose.connection.close();
    console.log('Database connection closed.');
    
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedGenres();
