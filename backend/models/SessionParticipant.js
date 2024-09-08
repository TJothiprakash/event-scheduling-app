const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sessionParticipantsSchema = new Schema({
  session_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session", // Reference to the Session collection
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User collection
    required: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "SessionParticipant",
  sessionParticipantsSchema
);
