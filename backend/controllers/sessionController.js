const jwt = require("jsonwebtoken"); // Import JWT for token verification
const Session = require("../models/Session"); // Import the Session model
const User = require("../models/User"); // Import the User model
const Availability = require("../models/Availability");


// Function to schedule a one-on-one session
const scheduleOneOnOneSession = async (req, res) => {
  try {
    console.log("inside one on one session function");

    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    console.log("oneonone session token " + token);

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is required." });
    }

    // Verify the token and extract the admin ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminId = decoded.id;

    // Destructure required fields from the request body
    const {
      title,
      description,
      adminSessionStartTime,
      adminSessionEndTime,
      participants,
    } = req.body;
    console.log("participants "+participants);

    
   
    
    

   // Check if participant's email is provided
    if (!participants || !participants) {
      return res
        .status(400)
        .json({ message: "Participant's email is required." });
    }

    // Find the participant by email
    const participantUser = await User.findOne({
      email: participants,
    });

    // If participant is not found, return an error
    if (!participantUser) {
      return res.status(404).json({ message: "Participant not found." });
    }

    // Check the scheduled date of the session
    console.log(adminSessionStartTime);
    
    const scheduledDate = new Date(adminSessionStartTime)
      .toISOString()
      .split("T")[0];

    // Get the participant's availability for the scheduled date
    const participantAvailability = await Availability.find({
      userId: participantUser._id,
      date: { $eq: scheduledDate },
    });

    // Check if the participant is available for the scheduled time
    const isAvailable = participantAvailability.some((slot) => {
      const slotStart = slot.startTime; // Assuming startTime is in number format (timestamp)
      const slotEnd = slot.endTime; // Assuming endTime is in number format (timestamp)
      return (
        (adminSessionStartTime >= slotStart &&
          adminSessionStartTime < slotEnd) || // Start time overlaps with the slot
        (adminSessionEndTime > slotStart && adminSessionEndTime <= slotEnd) || // End time overlaps with the slot
        (adminSessionStartTime <= slotStart && adminSessionEndTime >= slotEnd) // Entire slot is within the session time
      );
    });

    // If the participant is not available, return an error
    if (!isAvailable) {
      return res
        .status(400)
        .json({ message: "Participant does not have an available slot." });
    }

    // Create a new session object
    const newSession = new Session({
      admin_id: adminId, // Set the admin ID
      title, // Set the session title
      description, // Set the session description
      adminSessionStartTime, // Set the start time of the session
      adminSessionEndTime, // Set the end time of the session
      participants: [
        { user_id: participantUser._id, name: participantUser.username }, // Add the participant to the session
      ],
    });

    // Save the new session to the database
    await newSession.save();

    // Return a success response
    return res.status(201).json({
      message: "Session scheduled successfully.",
      session: newSession, // Return the created session
    });
  } catch (error) {
    console.error(error);
    // Return an error response if something goes wrong
    return res.status(500).json({ message: "Error scheduling session." });
  }
};

// Function to schedule a multi-participant session
const scheduleMultiParticipantSession = async (req, res) => {
  try {
    // Extract the authorization token from the request headers
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is required." });
    }

    // Verify the token to get the admin's ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminId = decoded.id;

    // Extract session details from the request body
    const { title, description, start_time, end_time, participants } = req.body;

    // Validate that there are participants in the request
    if (!participants || participants.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one participant is required." });
    }

    // Array to store unavailable participants
    const unavailableParticipants = [];

    // Loop through each participant to check their availability
    for (const participant of participants) {
      // Find the participant's user document by email or username
      const participantUser = await User.findOne({
        $or: [{ email: participant.email }, { username: participant.username }],
      });

      // Check if the participant exists in the database
      if (!participantUser) {
        unavailableParticipants.push(participant); // Add to unavailable if not found
        continue; // Skip to the next participant
      }

      // Get the scheduled date from start_time
      const scheduledDate = new Date(start_time).toISOString().split("T")[0];

      // Filter the participant's availability for the scheduled date
      const participantAvailability = participantUser.availability.filter(
        (slot) => {
          const slotDate = new Date(slot.startTime).toISOString().split("T")[0];
          return slotDate === scheduledDate; // Only include slots for the scheduled date
        }
      );

      // Check if the participant is available for the scheduled time
      const isAvailable = participantAvailability.some((slot) => {
        const slotStart = new Date(slot.startTime).getTime();
        const slotEnd = new Date(slot.endTime).getTime();
        return (
          (start_time >= slotStart && start_time < slotEnd) || // Start time overlaps with the slot
          (end_time > slotStart && end_time <= slotEnd) || // End time overlaps with the slot
          (start_time <= slotStart && end_time >= slotEnd) // Entire slot is within the session time
        );
      });

      // If the participant is not available, add them to the unavailable list
      if (!isAvailable) {
        unavailableParticipants.push(participant); // Collect unavailable participants
      }
    }

    // If there are unavailable participants, return their information
    if (unavailableParticipants.length > 0) {
      return res.status(400).json({
        message: "The following participants are unavailable:",
        unavailableParticipants,
      });
    }

    // Create a new session object if all participants are available
    const newSession = new Session({
      admin_id: adminId,
      title,
      description,
      start_time,
      end_time,
      participants: participants.map((participant) => ({
        user_id: participantUser._id,
        name: participantUser.username,
      })),
    });

    // Save the new session to the database
    await newSession.save();

    // Return success response with the created session
    return res.status(201).json({
      message: "Multi-participant session scheduled successfully.",
      session: newSession,
    });
  } catch (error) {
    console.error(error);
    // Handle errors and return appropriate response
    return res
      .status(500)
      .json({ message: "Error scheduling multi-participant session." });
  }
};


// Function to show all sessions scheduled by the admin
const showMySessions = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is required." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    const adminId = decoded.id;

    // Find sessions scheduled by the admin
    const sessions = await Session.find({ admin_id: adminId });

    // Return the list of sessions
    return res.status(200).json({
      message: "Sessions retrieved successfully.",
      sessions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error retrieving sessions." });
  }
};

// Export the functions to be used in the routes
module.exports = {
  scheduleOneOnOneSession,
  scheduleMultiParticipantSession,
  showMySessions,
};
