const express = require('express');
const router = express.Router();

// Controller functions
const dashboardController = require('../controllers/dashboardController');

// Route for viewing the admin dashboard
router.get('/', dashboardController.getDashboardPage);

module.exports = router;
