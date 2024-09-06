// models/Session.js
const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // Reference to the User model
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  sessionType: { type: String, enum: ['one-on-one', 'group'], required: true },
  status: { type: String, enum: ['booked', 'completed', 'cancelled'], default: 'booked' }
}, { timestamps: true });

module.exports = mongoose.model('Session', SessionSchema);
