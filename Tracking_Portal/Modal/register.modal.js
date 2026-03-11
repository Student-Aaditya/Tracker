const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: false,
      select: false,
    },

    googleId: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },

    role: {
      type: String,
      enum: ["administrator", "developer", "reporter", "pending"],
      default: "reporter",
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", registerSchema);

module.exports = User;
