// Answer Document Schema
const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  text: { type: String, required: true },
  ans_by: { type: String, required: true },
  ans_date_time: { type: Date, default: new Date()}
});

// Virtual for answer url
AnswerSchema.virtual("url").get(function () {
  return "/posts/answer/" + this._id;
});

module.exports = mongoose.model("Answer", AnswerSchema);
