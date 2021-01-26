const mongoose = require("mongoose");
const connection = require("../config/database");

const UserSchema = mongoose.Schema({
  admin: { type: Boolean, default: false, required: true },
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

UserSchema.virtual("name").get(function () {
  return this.fname + this.lname;
});

const UserModel = connection.model("User", UserSchema);

module.exports = UserModel;
