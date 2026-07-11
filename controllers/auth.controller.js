const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { publishToQueue } = require("../broker/rabbit");
const crypto = require("crypto");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await publishToQueue("user_created", {
      email: user.email,
      role: user.role,
      fullname: {
        firstName: user.name,
        lastName: "",
      },
    });

    const token = generateToken(user);

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      user,
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      user,
	  token:token
    });

  } catch (err) {

    res.status(500).json({
      message: "Server error",
    });

  }
};

exports.forgotPassword = async (req, res) => {

  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    user.passwordResetToken = resetToken;

    user.passwordResetExpires =
      Date.now() + 10 * 60 * 1000;

    await user.save();

    await publishToQueue(
      "password_reset_requested",
      {
        email: user.email,
        fullname: {
          firstName: user.name,
          lastName: "",
        },
        resetToken,
      }
    );

    res.status(200).json({
      message: "Reset email sent",
    });

  } catch (err) {

    res.status(500).json({
      message: "Server error",
    });

  }
};

exports.resetPassword = async (req, res) => {

  try {

    const { token, newPassword } = req.body;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });

  } catch (err) {

    res.status(500).json({
      message: "Server error",
    });

  }
};

exports.logout = async (req, res) => {

  try {

    res.clearCookie("token", cookieOptions);

    res.status(200).json({
      message: "Logged out successfully",
    });

  } catch (err) {

    res.status(500).json({
      message: "Server error",
    });

  }
};



exports.getTotalEarnings = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const seller = await User.findById(sellerId);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    const sellerOrders = seller.sellerOrders.filter(
      (item) =>
        item.sellerId?.toString() === sellerId.toString() ||
        item.sellerId === "SYSTEM_SEED"
    );

    if (!sellerOrders.length) {
      return res.status(200).json({
        success: true,
        totalOrders: 0,
        totalProductsSold: 0,
        totalEarnings: 0,
      });
    }

    const orders = sellerOrders.flatMap(
      (item) => item.orders
    );

    const totalOrders = orders.length;

    const totalProductsSold = orders.reduce(
      (sum, order) => sum + order.quantity,
      0
    );

    const totalEarnings = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    return res.status(200).json({
      success: true,
      totalOrders,
      totalProductsSold,
      totalEarnings,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.getProductWiseEarnings = async (
  req,
  res
) => {
  try {
    const sellerId = req.user.id ;
   
    const seller = await User.findById(sellerId);
	const sellerFilter = await User.findById(process.env.SYSTEM_SEED_USER_ID)
   console.log("WDQQ",seller)
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    const sellerOrders = seller.sellerOrders.filter(
      (item) =>
        item.sellerId?.toString() === sellerId.toString() ||
        item.sellerId?.toString() === process.env.SYSTEM_SEED_USER_ID?.toString()
    );

    if (!sellerOrders.length) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

  

    return res.status(200).json({
      success: true,
      data:sellerOrders,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};