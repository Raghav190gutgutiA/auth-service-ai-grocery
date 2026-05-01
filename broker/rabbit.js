const amqp = require("amqplib");
require("dotenv").config();

let connection = null;
let channel = null;
let isConnecting = false;

const RABBIT_URL = process.env.RABBITMQ_URI;
const RECONNECT_DELAY = 5000;

async function connectRabbitMQ() {
  if (channel || isConnecting) return channel;
  isConnecting = true;

  try {
    connection = await amqp.connect(`${RABBIT_URL}?heartbeat=60`);

    connection.on("error", (err) => {
      console.error("RabbitMQ connection error:", err.message);
    });

    connection.on("close", () => {
      console.error("RabbitMQ connection closed. Reconnecting...");
      channel = null;
      connection = null;
      isConnecting = false;
      setTimeout(connectRabbitMQ, RECONNECT_DELAY);
    });

    channel = await connection.createChannel();

    channel.on("error", (err) => {
      console.error("RabbitMQ channel error:", err.message);
    });

    channel.on("close", () => {
      console.error("RabbitMQ channel closed");
      channel = null;
    });

    console.log("RabbitMQ connected");
    isConnecting = false;
    return channel;
  } catch (error) {
    console.error("RabbitMQ connection failed:", error.message);
    channel = null;
    connection = null;
    isConnecting = false;
    setTimeout(connectRabbitMQ, RECONNECT_DELAY);
  }
}

async function publishToQueue(queueName, data) {
  const ch = await connectRabbitMQ();
  if (!ch) return;

  await ch.assertQueue(queueName, { durable: true });

  ch.sendToQueue(
    queueName,
    Buffer.from(JSON.stringify(data)),
    { persistent: true }
  );

  console.log(`Message sent to queue: ${queueName}`);
}

module.exports = {
  connectRabbitMQ,
  publishToQueue,
};
