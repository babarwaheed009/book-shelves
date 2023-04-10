const mongoose = require('mongoose');
const autoIncrement = require("mongoose-plugin-autoinc");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
userSchema.plugin(autoIncrement.plugin, {
    model: "User",
    field: "id",
    startAt: 1,
    incrementBy: 1,
  });
module.exports = mongoose.model('User', userSchema);