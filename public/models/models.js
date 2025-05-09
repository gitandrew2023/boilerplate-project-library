const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bookSchema = new Schema({
  title: { type: String, required: true },
  comments: [String],
  commentcount: { type: Number, default: 0 }
});

module.exports.Book = mongoose.model("book", bookSchema);