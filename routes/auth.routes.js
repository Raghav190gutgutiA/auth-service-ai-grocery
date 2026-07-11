const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  resetPassword,
  forgotPassword,
  getTotalEarnings,
  getProductWiseEarnings,
} = require("../controllers/auth.controller");

const { verifyToken, isAdmin } = require("../middlewares/userAuth");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.post("/reset-password", resetPassword);
router.post("/forgot-password", forgotPassword);

router.get("/total-earning",verifyToken,isAdmin,getTotalEarnings);
router.get("/product-wise-earning",verifyToken,isAdmin,getProductWiseEarnings);
// router.post("/reset-password", resetPassword);
module.exports = router;