const { subscribeToQueue } =
  require("./rabbit");

const User =
  require("../models/User");

require("dotenv").config();

function startUserListener() {

  subscribeToQueue(
    "earning_events",

    async (msg) => {

      const {

        type,

        orderId,

        productId,

        productName,

        productImage,

        sellerId,

        quantity,

        price,

        totalAmount,

        paymentStatus,

        orderStatus,

        shippingAddress,

        orderedAt,

      } = msg;

      try {

        if (
          type ===
          "ADD_EARNING"
        ) {

          const seller =
            await User.findOne({
              _id: sellerId,
            });

          if (!seller) {
            return;
          }

          seller.orders.push({

            orderId,

            productId,

            productName,

            productImage,

            sellerId,

            quantity,

            price,

            totalAmount,

            paymentStatus,

            orderStatus,

            shippingAddress,

            orderedAt,
          });

          await seller.save();

          console.log(
            `Order added for seller ${sellerId}`
          );
        }

      } catch (error) {

        console.error(
          "User order update failed:",
          error.message
        );
      }
    }
  );
}

module.exports =
  startUserListener;