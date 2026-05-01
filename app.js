const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Auth Service Running ✅" });
});

app.use("/api/auth", require("./routes/auth.routes"));

module.exports = app;