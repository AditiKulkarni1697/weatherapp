const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  ip: String,
  prefered_city: String,
});

const UserModel = mongoose.model("user", userSchema);

module.exports = { UserModel };
