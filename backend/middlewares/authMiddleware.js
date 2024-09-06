const express = require('express');
const { createAvailability, getUserAvailability } = require('../controllers/availabilityController');
const authMiddleware = require('../middlewares/authMiddleware'); // Make sure to import the middleware

const router = express.Router();

// Protect the routes with authMiddleware
router.post('/', authMiddleware, createAvailability); // Ensure the middleware is used here
router.get('/:userId', authMiddleware, getUserAvailability); // Add middleware here as well

module.exports = router;
