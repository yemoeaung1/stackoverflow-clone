// Question Document Schema
const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  title: { type: String, required: true, maxLength: 100 },
  text: { type: String, required: true },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
  asked_by: { type: String, default: "Anonymous" },
  ask_date_time: { type: Date, default: new Date()},
  views: { type: Number, min: 0, default: 0 },
});

// Virtual for book's URL
QuestionSchema.virtual("url").get(function () {
  return "/posts/question/" + this._id;
});

module.exports = mongoose.model("Question", QuestionSchema);
