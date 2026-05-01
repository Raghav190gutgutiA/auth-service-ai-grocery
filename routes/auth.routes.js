const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  resetPassword,
  forgotPassword,
} = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.post("/reset-password", resetPassword);
router.post("/forgot-password", forgotPassword);
// router.post("/reset-password", resetPassword);
module.exports = router;