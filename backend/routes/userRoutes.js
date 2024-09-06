const express = require('express');
const { registerUser, loginUser,logoutUser } = require('../controllers/userController');

const router = express.Router();

// Register
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);


// Logout
router.post('/logout', logoutUser);

module.exports = router;