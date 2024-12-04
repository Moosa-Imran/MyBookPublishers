const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');


// Route to render login page
router.get('/', homeController.renderHomePage);
router.get('/e-learning', homeController.renderELearningPage);
router.get('/contact', homeController.renderContactPage);
router.get('/training', homeController.renderTrainingPage);
router.get('/paper-generation', homeController.renderPaperGenerationPage);
router.get('/abc-games', homeController.renderAbcGamesPage);

module.exports = router;
