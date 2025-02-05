const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Route to render pages
router.get('/', contactController.renderContactPage);
router.post('/message', contactController.sendMessage);

module.exports = router;