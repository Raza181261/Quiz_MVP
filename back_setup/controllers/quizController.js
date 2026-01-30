const path = require("path");
const Quiz = require("../models/Quiz");
const Result = require("../models/Result");
const mongoose = require("mongoose");

// Create Quiz
exports.createQuiz = async (req, res) => {
  try {
    const { title, questions } = req.body;

    if (!title || !questions || !questions.length) {
      return res.status(400).json({ success: false, message: "Title and questions are required" });
    }

    const quiz = await Quiz.create({ title, questions });

    res.status(201).json({ success: true, quizId: quiz._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// Get Quiz by ID
exports.getQuizById = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// -------------------
// Upload Recording
// -------------------
exports.uploadRecording = (req, res) => {
  if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

  res.json({
    msg: "Recording uploaded successfully",
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`,
  });
};


// save result in DB
exports.saveResult = async (req, res) => {
  try {
    const { studentName, quizId, score, total, recordingURL } = req.body;

    if (!quizId || score === undefined || !recordingURL) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    const result = await Result.create({
      studentName,
      quizId: new mongoose.Types.ObjectId(quizId),
      score,
      total,
      recordingURL, // ✅ R2 URL only
    });

    res.json({
      success: true,
      msg: "Result saved successfully",
      result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


// -------------------
// Get All Results (Teacher)
// -------------------
exports.getResults = async (req, res) => {
  try {
    const results = await Result.find().sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
