const Availability = require("../models/Availability");
const jwt = require("jsonwebtoken");

// Create availability
exports.createAvailability = async (req, res) => {
  const { date, day, startTime, endTime } = req.body; // Get data from request body

  console.log("create availability request received ");
  
  // Extract userId from JWT token
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer token
 console.log("createavailabilyt  token "+ token);
 
  if (!token) {
    return res.status(403).json({ msg: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; // Get userId from token

    // Convert startTime and endTime to numbers (timestamps)
    const startTimeNum = new Date(startTime).getTime();
    const endTimeNum = new Date(endTime).getTime();
      console.log("time formatted  starttime in number format"+startTimeNum +"endtime "+endTimeNum);
      
    // Fetch existing availabilities for the user
    const existingAvailabilities = await Availability.find({ userId });

    // Check for conflicts with existing availabilities
    for (const availability of existingAvailabilities) {
      const existingStartTime = availability.startTime;
      const existingEndTime = availability.endTime;

      // Check for overlap
      if (
        (startTimeNum < existingEndTime && endTimeNum > existingStartTime) || // New session starts before existing ends
        startTimeNum === existingStartTime ||
        endTimeNum === existingEndTime || // New session starts or ends exactly at existing
        (startTimeNum > existingStartTime && startTimeNum < existingEndTime) || // New session starts inside existing
        (endTimeNum > existingStartTime && endTimeNum < existingEndTime) // New session ends inside existing
      ) {
        return res
          .status(400)
          .json({ msg: "Session conflicts with existing availability" });
      }
    }

    // Create new availability entry
    const availability = new Availability({
      userId,
      date,
      day,
      startTime: startTimeNum,
      endTime: endTimeNum,
    });

    await availability.save();
    console.log("availability created successfully");
    console.log("exiting the create availibility function");
    
    res.status(201).json({ msg: "Availability created successfully" });
  } catch (err) {
    console.log("error in createavailability fn returning 500 error ");
    
    res.status(500).json({ error: err.message });
  }
};


// Fetch availability for a user
exports.getUserAvailability = async (req, res) => {
  // Get token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1];
    console.log("token at the server side received "+ token);
    
  if (!token) {
    return res
      .status(401)
      .json({ error: "Unauthorized access, token required" });
  }

  try {
    // Verify and decode the token to get userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret
    const userId = decoded.id; // Ensure this matches the token structure

    console.log("Inside getUserAvailability with userID:", userId);

    // Fetch user availability
    const availability = await Availability.find({ userId });
    console.log("Fetch data successful");

    res.status(200).json(availability);
    console.log("Exiting getUserAvailability with success message");
  } catch (err) {
    console.error("Error in getUserAvailability:", err);
    res.status(500).json({ error: err.message });
  }
};
// Update availability
exports.updateAvailability = async (req, res) => {
  console.log("inside update availability function ");
  
  const sessionId = req.params.sessionId; // Get sessionId from URL parameters
  console.log("session id "+sessionId);
  
  const { date, day, startTime, endTime } = req.body; // Get new data from request body

  try {
    const updatedAvailability = await Availability.findByIdAndUpdate(
      sessionId,
      { date, day, startTime, endTime },
      { new: true } // Return the updated document
    
      
    );

    if (!updatedAvailability) {
      console.log("available slot not found");
      
      return res.status(404).json({ msg: "Available slot not found" });
    }
  console.log("availability  updated successfully");
  
    res
      .status(200)
      .json({ msg: "Availability updated successfully", updatedAvailability });
  } catch (err) {
    console.log("error happened in update availability function");
    
    res.status(500).json({ error: err.message });
  }
};

// Delete availability
exports.deleteAvailability = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const deletedAvailability = await Availability.findByIdAndDelete(sessionId);

    if (!deletedAvailability) {
      return res.status(404).json({ msg: "Available slot not found" });
    }

    res
      .status(200)
      .json({ msg: "Availability booked slot deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
