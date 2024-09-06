// controllers/availabilityController.js
const Availability = require('../models/Availability');
const jwt = require('jsonwebtoken');

// Create availability
exports.createAvailability = async (req, res) => {
  const { date, day, startTime, endTime } = req.body; // Get data from request body

  // Extract userId from JWT token
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer token
  console.log(token + " is it");

  if (!token) {
    return res.status(403).json({ msg: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; // Get userId from token

    // Create new availability entry
    const availability = new Availability({
      userId,
      date,
      day,
      startTime,
      endTime,
    });

    await availability.save();
    res.status(201).json({ msg: 'Availability created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch availability for a user
exports.getUserAvailability = async (req, res) => {
  const { userId } = req.params;
  console.log("inside booked slots");

  try {
    const availability = await Availability.find({ userId });
    res.status(200).json(availability);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Update session
exports.updateSession = async (req, res) => {
  const sessionId = req.params.sessionId; // Get sessionId from URL parameters
  const { date, day, startTime, endTime } = req.body; // Get new data from request body

  try {
    const updatedAvailability = await Availability.findByIdAndUpdate(
      sessionId,
      { date, day, startTime, endTime },
      { new: true } // Return the updated document
    );

    if (!updatedAvailability) {
      return res.status(404).json({ msg: 'Session not found' });
    }

    res.status(200).json({ msg: 'Session updated successfully', updatedAvailability });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Delete session
exports.deleteSession = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const deletedAvailability = await Availability.findByIdAndDelete(sessionId);

    if (!deletedAvailability) {
      return res.status(404).json({ msg: 'Session not found' });
    }

    res.status(200).json({ msg: 'Session deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
