const express = require("express");const {
  scheduleOneOnOneSession,
  scheduleMultiParticipantSession,
  showMySessions,
} = require("../controllers/sessionController");

const router = express.Router();

/**
 * @swagger
 * /schedule:
 *   post:
 *     summary: Schedule a one-on-one session
 *     description: Schedules a one-on-one session between an admin and a user based on the user's availability.
 *     tags: [Session]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user.
 *               adminSessionStartTime:
 *                 type: string
 *                 description: The start time of the session (ISO format or timestamp).
 *               adminSessionEndTime:
 *                 type: string
 *                 description: The end time of the session (ISO format or timestamp).
 *               sessionAgenda:
 *                 type: string
 *                 description: The agenda of the session.
 *               sessionMessage:
 *                 type: string
 *                 description: Any additional message for the session.
 *     responses:
 *       201:
 *         description: Session booked successfully.
 *       400:
 *         description: Bad request or availability conflict.
 *       500:
 *         description: Internal server error.
 */
router.post("/schedule", scheduleOneOnOneSession);

/**
 * @swagger
 * /mysessions:
 *   get:
 *     summary: Fetch upcoming sessions
 *     description: Retrieves all upcoming sessions for the user based on the token.
 *     tags: [Session]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sessions fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       sessionId:
 *                         type: string
 *                       startTime:
 *                         type: string
 *                         description: The start time of the session.
 *                       endTime:
 *                         type: string
 *                         description: The end time of the session.
 *                       sessionType:
 *                         type: string
 *                         description: The type of the session (one-on-one or multi-participant).
 *                       participants:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             name:
 *                               type: string
 *                             email:
 *                               type: string
 *                             role:
 *                               type: string
 *       403:
 *         description: No token provided.
 *       500:
 *         description: Internal server error.
 */
router.get("/mysessions", showMySessions);

/**
 * @swagger
 * /scheduleMultiParticipantSession:
 *   post:
 *     summary: Schedule a multi-participant session
 *     description: Schedules a session with multiple participants.
 *     tags: [Session]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of user IDs participating in the session.
 *               adminSessionStartTime:
 *                 type: string
 *                 description: The start time of the session (ISO format or timestamp).
 *               adminSessionEndTime:
 *                 type: string
 *                 description: The end time of the session (ISO format or timestamp).
 *               sessionAgenda:
 *                 type: string
 *                 description: The agenda of the session.
 *               sessionMessage:
 *                 type: string
 *                 description: Any additional message for the session.
 *     responses:
 *       201:
 *         description: Multi-participant session booked successfully.
 *       400:
 *         description: Some users are unavailable.
 *       500:
 *         description: Internal server error.
 */
router.post(
  "/scheduleMultiParticipantSession",
  scheduleMultiParticipantSession
);

module.exports = router;
