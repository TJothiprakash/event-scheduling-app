const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    admin_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model for the admin
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    adminSessionStartTime: {
      type: Number, // Store as timestamp
      required: true,
    },
    adminSessionEndTime: {
      type: Number, // Store as timestamp
      required: true,
    },
    participants: [
      {
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Reference to the User model for participants
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);
