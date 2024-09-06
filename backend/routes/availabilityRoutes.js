// routes/availabilityRoutes.js
const express = require('express');
const {
  createAvailability,
  getUserAvailability,
  updateSession,
  deleteSession,
} = require('../controllers/availabilityController');

const router = express.Router();

// Create availability
router.post('/', createAvailability);

// Fetch user availability
router.get('/getbookedslots', getUserAvailability);

// Update session
router.put('/updatesession/:sessionId', updateSession); // Assuming sessionId is sent in the body

// Delete session
router.delete('/deletesession/:sessionId', deleteSession); // sessionId is in the URL parameters

module.exports = router;
