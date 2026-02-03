const express = require("express");
const cors = require("cors");
const quizRoutes = require("./routes/quizRoutes");
const path = require("path");

const app = express();

// app.use(
//   cors({
//     // origin: process.env.ORIGIN,
//     origin: ["http://localhost:3000"],
//     credentials: true,
//   }),
// );

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Quiz routes
app.use("/api/quiz", quizRoutes);

module.exports = app;
