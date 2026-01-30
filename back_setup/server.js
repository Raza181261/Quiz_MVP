// require("dotenv").config();
require("dotenv").config({ path: "config/.env" });
const app = require("./app");
const connectDatabase = require("./db/index");
const path = require("path");
const express = require("express");


// Handling uncaught exceptions
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to uncaught exception");
    process.exit(1);
});


// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "config/.env" });
}

// connect DB
connectDatabase();


// Serve Uploads Folder (Recordings)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Create server
const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});


// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.log(`Shutting down the server due to ${err.message}`);
    console.log("Shutting down the server due to unhandled promise rejection");

    server.close(() => {
        process.exit(1);
    });
});