const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const quizController = require("../controllers/quizController");
const uploadController = require("../controllers/uploadController");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Routes
router.post("/create", quizController.createQuiz);
router.get("/:quizId", quizController.getQuizById);
// router.post("/upload", upload.single("recording"), quizController.uploadRecording);
router.post("/save-result", quizController.saveResult);
router.get("/results/:quizId", quizController.getResults);

router.post("/r2-upload-url", uploadController.getUploadUrl);

module.exports = router;
