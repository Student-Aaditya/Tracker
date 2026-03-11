const mongoose = require("mongoose");

const connectDB = async () => {
  try {

    await mongoose.connect("mongodb://127.0.0.1:27017/issue_tracker");

    console.log("Mongoose connected successfully");

  } catch (err) {

    console.error("MongoDB connection failed:", err.message);

  }
};

module.exports = connectDB;