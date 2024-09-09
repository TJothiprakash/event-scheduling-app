const jwt = require("jsonwebtoken"); // Import JWT for token verification
const Session = require("../models/Session"); // Import the Session model
const User = require("../models/User"); // Import the User model
const Availability = require("../models/Availability");
const SessionParticipant = require("../models/SessionParticipant");

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
    console.log("participants " + participants);

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
    console.log("Inside multi-participant session function");

    // Verify the token to get the admin's ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminId = decoded.id;
    console.log("Admin ID retrieved from the token: " + adminId);

    // Extract session details from the request body
    const {
      title,
      description,
      adminSessionStartTime, // Should be a timestamp (Number)
      adminSessionEndTime, // Should be a timestamp (Number)
      participants,
    } = req.body;

    console.log("Participants: ", participants);

    // Validate that there are participants in the request
    if (!participants || participants.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one participant is required." });
    }

    // Array to store unavailable participants
    const unavailableParticipants = [];
    // Array to store participant data for the session
    const participantData = [];

    // Loop through each participant to check their availability
    for (const participant of participants) {
      console.log(
        "Searching for participant with email: " + participant.trim()
      );

      // Find participant in the database
      const participantUser = await User.findOne({
        email: participant.trim(), // Trim spaces
      });

      // Check if the participant exists in the database
      if (!participantUser) {
        console.log(
          "Participant not available in the database: " + participant
        );
        unavailableParticipants.push(participant); // Add to unavailable if not found
        continue; // Skip to the next participant
      }

      // Get the scheduled date from adminSessionStartTime
      const scheduledDate = new Date(adminSessionStartTime)
        .toISOString()
        .split("T")[0];
      console.log("Scheduled Date: " + scheduledDate);

      // Filter the participant's availability for the scheduled date
      const participantAvailability = await Availability.find({
        userId: participantUser._id,
        date: {
          $eq: new Date(adminSessionStartTime).toISOString().split("T")[0],
        },
      });

      console.log("Participant availability: ", participantAvailability);

      // Check if the participant is available for the scheduled time
      const isAvailable = participantAvailability.some((slot) => {
        // Compare timestamps
        const slotStart = slot.startTime; // Timestamp
        const slotEnd = slot.endTime; // Timestamp

        return (
          (adminSessionStartTime >= slotStart &&
            adminSessionStartTime < slotEnd) || // Start time overlaps with the slot
          (adminSessionEndTime > slotStart && adminSessionEndTime <= slotEnd) || // End time overlaps with the slot
          (adminSessionStartTime <= slotStart && adminSessionEndTime >= slotEnd) // Entire slot is within the session time
        );
      });

      // If the participant is not available, add them to the unavailable list
      if (!isAvailable) {
        console.log(
          "Unavailable participant based on available slots: " + participant
        );
        unavailableParticipants.push(participant); // Collect unavailable participants
      } else {
        // Store participant data for the session if they are available
        participantData.push({
          user_id: participantUser._id,
          name: participantUser.username,
        });
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
      adminSessionStartTime,
      adminSessionEndTime,
      participants: participantData, // Use stored participant data
    });
      console.log("new session created successfully "+newSession);
      


    // Save the new session to the database
    await newSession.save();
        console.log("session scheduled successfully");
        
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

// Function to show user's sessions
const showMySessions = async (req, res) => {
  try {
    // Get the token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authorization token is required." });
    }

    // Verify the token to get the user's ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; // User ID from the token

    console.log("User ID retrieved from the token: " + userId);

    // Query the SessionParticipant collection to find all sessions the user is part of
    const participantSessions = await SessionParticipant.find({ user_id: userId })
      .populate('session_id'); // Populate session_id to get session details

    // Extract session IDs from the participant sessions
    const sessionIds = participantSessions.map(participant => participant.session_id._id);

    // Query the Session collection to get the session details
    const sessions = await Session.find({ _id: { $in: sessionIds } })
      .populate({
        path: 'admin_id',
        select: 'username', // Get the admin's username
      })
      .populate({
        path: 'participants.user_id',
        select: 'username email', // Get the participant's username and email
      });

    // Format the response to include the required details
    const formattedSessions = sessions.map(session => ({
      sessionId: session._id,
      adminUsername: session.admin_id.username,
      participants: session.participants.map(participant => ({
        username: participant.name,
        email: participant.user_id.email, // Email of the participant
      })),
      date: new Date(session.adminSessionStartTime).toISOString().split('T')[0], // Format date
      startTime: new Date(session.adminSessionStartTime).toLocaleTimeString(), // Format start time
      endTime: new Date(session.adminSessionEndTime).toLocaleTimeString(), // Format end time
    }));

    return res.status(200).json({ sessions: formattedSessions });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return res.status(500).json({ message: "Server error while fetching sessions." });
  }
};

// Export the functions to be used in the routes
module.exports = {
  scheduleOneOnOneSession,
  scheduleMultiParticipantSession,
  showMySessions,
};
