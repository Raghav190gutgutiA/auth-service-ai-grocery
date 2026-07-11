const mongoose =
  require("mongoose");

const orderItemSchema =
  new mongoose.Schema(
    {
      orderId: {
        type:
          mongoose.Schema.Types
            .ObjectId,
      },

      productId: {
        type:
          mongoose.Schema.Types
            .ObjectId,
      },

      name: {
        type: String,
      },
      image: {
        type: String,
      },

      sellerId: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "User",
      },

      quantity: {
        type: Number,
      },

      price: {
        type: Number,
      },

      totalAmount: {
        type: Number,
      },

      paymentStatus: {
        type: String,
      },

      orderStatus: {
        type: String,
      },

      shippingAddress: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: String,
      },

      orderedAt: {
        type: Date,
        default: Date.now,
      },
    },

    {
      _id: false,
    }
  );

const sellerOrderSchema =
  new mongoose.Schema(
    {
      sellerId: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "User",
        required: true,
      },

      orders: [
        orderItemSchema,
      ],
    },

    {
      _id: false,
    }
  );

const userSchema =
  new mongoose.Schema(
    {

      name: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },

      password: {
        type: String,
        required: true,
      },

      googleId: {
        type: String,
      },

      role: {
        type: String,
        enum: [
          "user",
          "admin",
        ],
        default: "user",
      },

      isVerified: {
        type: Boolean,
        default: false,
      },

      profile: {

        phone: String,

        preferences: {

          diet: {
            type: String,
            default: "veg",
          },

          allergies: [
            String,
          ],

          cuisines: [
            String,
          ],
        },
      },

      addresses: [
        {
          street: String,
          city: String,
          pincode:
            String,
          state: String,
          country:
            String,
        },
      ],

      sellerOrders: [
        sellerOrderSchema,
      ],

      passwordResetToken:
        String,

      passwordResetExpires:
        Date,
    },

    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "User",
    userSchema
  );

