const authController = require("../Controller/authController");
const express = require("express");
const router = express.Router();
const passport = require("../config/passportGoogle.js");
const auth = require("../Middleware/auth.middleware.js");

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get(
  "/google",
  (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return res.status(501).json({ msg: "Google login is not configured" });
    }
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authController.googleCallback
);

router.patch("/role", auth, authController.setRole);

module.exports = router;