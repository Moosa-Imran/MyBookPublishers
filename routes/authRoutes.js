const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


// Route to render login page
router.get('/login', authController.renderLoginPage);

// Route to handle login
router.post('/login', authController.login);

// Route to handle logout
router.get('/logout', authController.logout);

module.exports = router;
