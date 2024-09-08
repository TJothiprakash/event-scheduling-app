const express = require("express");
const {
  createAvailability,
  getUserAvailability,
  updateAvailability, // Standardized camelCase
  deleteAvailability, // Standardized camelCase
} = require("../controllers/availabilityController");
const { swaggerDocs } = require("../swaggerConfig");

const router = express.Router();

// Create availability
/**
 * @swagger
 * /api/availability:
 *   post:
 *     summary: Create a new availability slot
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               day:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Availability created successfully
 *       400:
 *         description: Session conflicts with existing availability
 *       403:
 *         description: No token provided
 *       500:
 *         description: Internal server error
 */
router.post("/", createAvailability);

// Fetch user availability
/**
 * @swagger
 * /api/availability/getbookedslots:
 *   get:
 *     summary: Fetch all availability slots for a user
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user whose availability is being fetched
 *     responses:
 *       200:
 *         description: List of availability slots
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/getbookedslots", getUserAvailability);

// Update availability (sessionId is in URL parameters)
/**
 * @swagger
 * /api/availability/updateavailability/{sessionId}:
 *   put:
 *     summary: Update an existing availability slot
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the session to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               day:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Availability updated successfully
 *       404:
 *         description: Slot not found
 *       500:
 *         description: Internal server error
 */
router.put("/updateavailability/:sessionId", updateAvailability);

// Delete availability (sessionId is in URL parameters)
/**
 * @swagger
 * /api/availability/deleteavailability/{sessionId}:
 *   delete:
 *     summary: Delete an availability slot
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the session to delete
 *     responses:
 *       200:
 *         description: Availability deleted successfully
 *       404:
 *         description: Slot not found
 *       500:
 *         description: Internal server error
 */
router.delete("/deleteavailability/:sessionId", deleteAvailability);

module.exports = router;
