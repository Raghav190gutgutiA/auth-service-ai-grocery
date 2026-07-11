const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.CLIENT_URL
];
app.use(cookieParser());

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Auth Service Running ✅" });
});

app.use("/api/auth", require("./routes/auth.routes"));

module.exports = app;