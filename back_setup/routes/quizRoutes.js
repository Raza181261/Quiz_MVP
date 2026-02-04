const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const quizController = require("../controllers/quizController");
const uploadController = require("../controllers/uploadController");


// Routes
router.post("/create", quizController.createQuiz);
router.post("/save-result", quizController.saveResult);
router.get("/results/:quizId", quizController.getResults);

// get all recordings for teacher
router.get("/all-recordings", quizController.getAllRecordings);
// Get presigned URL for a single recording
router.get("/recordings/:id/presigned", quizController.getRecordingPresignedUrl);

router.get("/:quizId", quizController.getQuizById);
router.post("/r2-upload-url", uploadController.getUploadUrl);

module.exports = router;
