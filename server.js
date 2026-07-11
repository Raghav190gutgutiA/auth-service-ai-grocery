const mongoose = require("mongoose");
const app = require("./app");
const { connectRabbitMQ } = require("./broker/rabbit");
const { startUserListener } = require("./broker/listener");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected ✅");

    await connectRabbitMQ();
    startUserListener()
    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT} 🚀`
      );
    });
  })
  .catch((err) => {
    console.error(
      "DB Connection Failed ❌",
      err
    );
  });