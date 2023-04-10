const express = require("express");
const auth = require("../middleware/auth.middleware");
const { getGenres } = require("../controllers/genre.controller");
const app = express();

app.get("/genres", auth, getGenres);

module.exports = app;
