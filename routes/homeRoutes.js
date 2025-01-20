const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');


// Route to render login page
router.get('/', homeController.renderHomePage);
router.get('/e-learning', homeController.renderELearningPage);
router.get('/contact', homeController.renderContactPage);
router.get('/training', homeController.renderTrainingPage);
router.get('/paper-generation', homeController.renderPaperGenerationPage);
router.get('/edu-games', homeController.renderEduGames);
router.get('/english-games', homeController.renderEnglishGames);
router.get('/math-games', homeController.renderMathGames);
router.get('/urdu-games', homeController.renderUrduGames);
router.get('/abc-tracing', homeController.renderAbcTracing);
router.get('/alphabet-game', homeController.renderAlphabetGame);
router.get('/objects-game', homeController.renderObjectsGame);
router.get('/organize-game', homeController.renderOrganizeGame);
router.get('/drawAlphabets-game', homeController.renderDrawAlphabetsGame);
router.get('/letter-game', homeController.renderLetterGame);
router.get('/numberTracing-game', homeController.renderNumberTracingGame);
router.get('/matchCounting-game', homeController.renderMatchCountGame);
router.get('/howMany-game', homeController.renderHowMany);
router.get('/counting-game', homeController.renderCountingGame);
router.get('/familyMatching-game', homeController.renderFamilyMatchingGame);
router.get('/abc-games', homeController.renderAbcGamesPage);

module.exports = router;
