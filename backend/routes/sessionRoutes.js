// routes/sessionRoutes.js
const express = require('express');
const { scheduleOneOnOneSession } = require('../controllers/sessionController'); 

const {  getAllSessionsByUser } = require('../controllers/sessionController');

const { scheduleMultiParticipantSession } = require('../controllers/sessionController');

const { showMySessions } = require('../controllers/sessionController');

const router = express.Router();

// Schedule one-on-one session
router.post('/schedule', scheduleOneOnOneSession); 


// Route for fetching upcoming sessions
router.get('/mysessions', showMySessions); 

// Schedule multi-participant session
router.post('/scheduleMultiParticipantSession', scheduleMultiParticipantSession);


// Get all sessions by user
/*router.get('/sessions', getAllSessionsByUser); */
module.exports = router;
