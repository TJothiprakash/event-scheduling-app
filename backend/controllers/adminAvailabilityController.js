const Availability = require('../models/Availability');

// Get all users' availability
exports.getAllUserAvailability = async (req, res) => {
  const { date } = req.query; // Get date from query params if needed
    console.log("get all user availiability request received ");
    
  try {
    const availability = await Availability.find({})
      .populate("userId", "username email") // Populate userId with username and email from User model
      .exec(); // Execute the query; // Fetch all availability entries
    console.log("request processed");

    res.status(200).json(availability);
  } catch (err) {
    console.log("request error");
    
    res.status(500).json({ error: err.message });
  }
};
