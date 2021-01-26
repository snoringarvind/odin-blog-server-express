const mongoose = require("mongoose");
const connection = require("../config/database");

const CommentSchema = mongoose.Schema({
  comment: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
});

const CommentModel = connection.model("Comment", CommentSchema);

module.exports = CommentModel;
