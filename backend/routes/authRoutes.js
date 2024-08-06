const express = require('express');
const router = express.Router();
const { registerUser, loginUser, token } = require('../controllers/authController');

// Register Route
router.post('/register', registerUser);

// Login Route
router.post('/login', loginUser);

// Refresh Token
router.post('/token', token);

module.exports = router;
