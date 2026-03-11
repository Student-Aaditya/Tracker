const User = require("../Modal/register.modal.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

const authController = {
  register: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ msg: "All fields are required" });
      }

      const existUser = await User.findOne({ email });

      if (existUser) {
        return res.status(400).json({ msg: "User already exists" });
      }

      const hashPassword = await bcrypt.hash(password, saltRounds);

      const user = new User({
        name,
        email,
        password: hashPassword,
        role,
      });

      await user.save();

      res.status(201).json({
        msg: "User registered successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      res.status(500).json({
        msg: "Server Error",
        error: err.message,
      });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        return res.status(400).json({ msg: "Email and password required" });
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return res.status(400).json({ msg: "User not found" });
      }

      if (!user.password) {
        return res.status(400).json({ msg: "This account uses Google sign-in. Please log in with Google." });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid password" });
      }

      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
      );

      res.status(200).json({
        msg: "Login successful",
        token: token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      res.status(500).json({
        msg: "Server Error",
        error: err.message,
      });
    }
  },

  googleCallback: (req, res) => {
    const user = req.user;
    if (!user) {
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      return res.redirect(`${frontendUrl}?auth=failed`);
    }
    const jwt = require("jsonwebtoken");
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}?token=${token}&role=${encodeURIComponent(user.role)}`);
  },

  setRole: async (req, res) => {
    try {
      const { role } = req.body;
      const allowed = ["administrator", "developer", "reporter"];

      if (!allowed.includes(role)) {
        return res.status(400).json({ msg: "Invalid role" });
      }

      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      user.role = role;
      await user.save();

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(200).json({
        msg: "Role updated",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      res.status(500).json({
        msg: "Server Error",
        error: err.message,
      });
    }
  },
};

module.exports = authController;
