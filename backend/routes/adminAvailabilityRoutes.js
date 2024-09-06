const express = require('express');
const { getAllUserAvailability } = require('../controllers/adminAvailabilityController');
const checkAdmin = require('../middlewares/checkAdmin');

const router = express.Router();

// Fetch all users' availability (Admin only)
router.get('/all', checkAdmin, getAllUserAvailability);

module.exports = router;
