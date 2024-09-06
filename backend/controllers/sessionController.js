// controllers/sessionController.js
const Session = require('../models/Session');
const Availability = require('../models/Availability');
/*const GroupSession = require('../models/GroupSession');*/
const jwt = require('jsonwebtoken');

// Schedule one-on-one session
exports.scheduleOneOnOneSession = async (req, res) => {
    const { userId, adminSessionStartTime, adminSessionEndTime } = req.body;

    try {
        // Fetch user's availability
        const userAvailability = await Availability.find({ userId });

        // Check if the userAvailability is null or empty
        if (!userAvailability || userAvailability.length === 0) {
            return res.status(404).json({ msg: `No availability found for user with ID ${userId}.` });
        }

        // Check if the user is available in the requested time slot
        const isAvailable = userAvailability.some(slot => {
            // Ensure slot is defined properly and contains startTime and endTime
            return slot && slot.startTime && slot.endTime &&
                adminSessionStartTime >= slot.startTime &&
                adminSessionEndTime <= slot.endTime;
        });

        if (!isAvailable) {
            return res.status(400).json({ msg: `User with ID ${userId} is not available during the requested time.` });
        }

        // Create new session
        const session = new Session({
            userId,
            startTime: adminSessionStartTime,
            endTime: adminSessionEndTime,
        });

        await session.save();
        res.status(201).json({ msg: 'Session booked successfully', session });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// Schedule multi-participant session
exports.scheduleMultiParticipantSession = async (req, res) => {
    const { userIds, adminSessionStartTime, adminSessionEndTime } = req.body; // Get userIds, start and end time from request body

    try {
        let unavailableUsers = [];

        // Loop through each userId and check their availability
        for (let userId of userIds) {
            const userAvailability = await Availability.find({ userId });

            // Check if user is available within the admin's session time
            const isAvailable = userAvailability.some(slot => {
                return (
                    adminSessionStartTime >= slot.startTime && 
                    adminSessionEndTime <= slot.endTime
                );
            });

            // If the user is not available, add them to the unavailableUsers list
            if (!isAvailable) {
                unavailableUsers.push(userId);
            }
        }

        // If there are users with conflicts, return the conflict message
        if (unavailableUsers.length > 0) {
            return res.status(400).json({ 
                msg: 'Some users are not available during the requested time.', 
                unavailableUsers 
            });
        }

        // If all users are available, create a new session
        const session = new Session({
            userIds, // Save all userIds participating in the session
            startTime: adminSessionStartTime,
            endTime: adminSessionEndTime,
            sessionType: 'multi-participant' // Optional: specify session type
        });

        await session.save();
        res.status(201).json({ msg: 'Session booked successfully', session });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Fetch all upcoming sessions for a user or admin
exports.showMySessions = async (req, res) => {
    // Extract the token from the request header
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer token

    if (!token) {
        return res.status(403).json({ msg: 'No token provided' });
    }

    try {
        // Verify the token and extract user information
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id; // Get userId from token

        // Find sessions that the user is involved in (including past sessions)
        const sessions = await Session.find({
            participants: userId,  // Assuming `participants` array contains user IDs
        }).populate('participants', 'email name role'); // Populating participant details with email, name, and role

        // If no sessions are found
        if (sessions.length === 0) {
            return res.status(200).json({ msg: 'No sessions found' });
        }

        // Format the response to show detailed information
        const sessionDetails = sessions.map(session => ({
            sessionId: session._id,
            startTime: session.startTime,
            endTime: session.endTime,
            sessionType: session.sessionType,
            participants: session.participants.map(participant => ({
                id: participant._id,
                name: participant.name,
                email: participant.email,
                role: participant.role, // Indicating if they are admin or regular user
            }))
        }));

        res.status(200).json({ msg: 'Sessions fetched successfully', sessions: sessionDetails });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/*
// Get all sessions by user
exports.getAllSessionsByUser = async (req, res) => {
    const userId = req.user.id; // Assuming user ID is obtained from the JWT token

    try {
        // Fetch one-on-one sessions
        const oneOnOneSessions = await Session.find({ userId });

        // Fetch group sessions where the user is a participant
        const groupSessions = await GroupSession.find({ participants: userId });

        // Combine results
        const allSessions = [...oneOnOneSessions, ...groupSessions];

        res.status(200).json({ allSessions });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};*/