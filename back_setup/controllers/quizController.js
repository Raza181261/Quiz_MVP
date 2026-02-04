const path = require("path");
const Quiz = require("../models/Quiz");
const Result = require("../models/Result");
const mongoose = require("mongoose");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const r2 = require("../utilis/r2");

// Create Quiz
exports.createQuiz = async (req, res) => {
  try {
    const { title, questions } = req.body;

    if (!title || !questions || !questions.length) {
      return res
        .status(400)
        .json({ success: false, message: "Title and questions are required" });
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
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }

    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
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


// Fetch all recordings metadata
exports.getAllRecordings = async (req, res) => {
  try {
    const recordings = await Result.find()
      .sort({ createdAt: -1 })
      .select("studentName quizId score total recordingURL createdAt");
    res.json(recordings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


// Get Presigned URL for a Recording
exports.getRecordingPresignedUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Result.findById(id);
    if (!result) return res.status(404).json({ msg: "Recording not found" });

    if (!result.recordingURL) {
      return res.status(400).json({ msg: "Recording URL missing" });
    }

    const url = new URL(result.recordingURL);
    // const Key = url.pathname.substring(1);
    let Key = url.pathname;
    Key = Key.startsWith("/") ? Key.slice(1) : Key;

    if (Key.startsWith(process.env.R2_BUCKET_NAME + "/")) {
      Key = Key.replace(process.env.R2_BUCKET_NAME + "/", "");
    }
    // console.log("Bucket:", process.env.R2_BUCKET_NAME);
    // console.log("Key:", Key);

    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key,
    });

    const presignedUrl = await getSignedUrl(r2, command, {
      expiresIn: 60 * 10,
    }); // 10 min
    res.json({ presignedUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to generate presigned URL" });
  }
};
