
const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    studentName: {
      type: String,
      default: "Anonymous",
    },
    score: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    recordingURL: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);
