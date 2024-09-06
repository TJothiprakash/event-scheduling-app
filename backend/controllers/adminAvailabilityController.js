const Availability = require('../models/Availability');

// Get all users' availability
exports.getAllUserAvailability = async (req, res) => {
  const { date } = req.query; // Get date from query params if needed

  try {
    const availability = await Availability.find({}); // Fetch all availability entries
    res.status(200).json(availability);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
