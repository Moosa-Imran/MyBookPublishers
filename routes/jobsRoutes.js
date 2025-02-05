const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobsController');

// Route to render pages
router.get('/', jobsController.renderJobsPage);
router.get('/video-editor', jobsController.renderVideoEditorAd);

module.exports = router;

