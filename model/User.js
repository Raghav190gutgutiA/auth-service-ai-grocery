const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
 
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required:true
  },

  googleId: {
    type: String
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  
  profile: {
    phone: String,

    preferences: {
      diet: {
        type: String, 
        default: "veg"
      },

      allergies: [String],

      cuisines: [String] 
    }
  },

  
  addresses: [
    {
      street: String,
      city: String,
      pincode: String,
      state: String,
      country: String
    }
  ],

  passwordResetToken: String,
  passwordResetExpires: Date

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);