// models/GroupSession.js
const mongoose = require('mongoose');

const GroupSessionSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }], // List of participants
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  sessionType: { type: String, enum: ['group'], required: true },
  status: { type: String, enum: ['booked', 'completed', 'cancelled'], default: 'booked' }
}, { timestamps: true });

module.exports = mongoose.model('GroupSession', GroupSessionSchema);
