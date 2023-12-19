const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: String, // User's Google ID
  name: String, // User's name
  picture: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
