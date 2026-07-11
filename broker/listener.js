const amqp = require("amqplib");

const User = require("../model/User");

require("dotenv").config();

async function startUserListener() {
  try {
    const connection = await amqp.connect(
      process.env.RABBITMQ_URI
    );

    const channel =
      await connection.createChannel();

   const q= await channel.assertQueue(
      "earning_events",
      {
        durable: true,
      }
    );
console.log(q);
    console.log(
      "Listening to earning_events..."
    );

    channel.consume(
      "earning_events",
      async (msg) => {
		console.log("checkk",msg)
        if (!msg) return;

        try {
          const data = JSON.parse(
            msg.content.toString()
          );
        console.log("allData",data)
          const {
            type,
            orderId,
            productId,
            name,
            image,
            sellerId,
            quantity,
            price,
            totalAmount,
            paymentStatus,
            orderStatus,
            shippingAddress,
            orderedAt,
          } = data;

          if (
            type !==
            "ADD_EARNING"
          ) {
            channel.ack(msg);
            return;
          }

          console.log(
            data,
            "hello"
          );

          const seller =
            await User.findById(
              sellerId
            );

          if (!seller) {
            channel.ack(msg);
            return;
          }
const existingSellerOrder = seller.sellerOrders.find(
  (item) => item.sellerId.toString() === sellerId.toString()
);

if (existingSellerOrder) {
  existingSellerOrder.orders.push({
    orderId,
    productId,
    name,
    image,
    sellerId,
    quantity,
    price,
    totalAmount,
    paymentStatus,
    orderStatus,
    shippingAddress,
    orderedAt,
  });
} else {
  seller.sellerOrders.push({
    sellerId,
    orders: [
      {
        orderId,
        productId,
        name,
        image,
        sellerId,
        quantity,
        price,
        totalAmount,
        paymentStatus,
        orderStatus,
        shippingAddress,
        orderedAt,
      },
    ],
  });
}

await seller.save();

          console.log(
            `Order added for seller ${sellerId}`
          );

          channel.ack(msg);
        } catch (error) {
          console.error(
            "User order update failed:",
            error.message
          );

          channel.nack(
            msg,
            false,
            false
          );
        }
      }
    );
  } catch (error) {
    console.error(
      "RabbitMQ Listener Error:",
      error.message
    );
  }
}

module.exports = {
  startUserListener,
};