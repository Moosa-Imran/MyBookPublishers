// Render Home Pages
exports.renderHomePage = (req, res) => {
    res.render('index');
};

exports.renderELearningPage = (req, res) => {
    res.render('e-learning');
};

exports.renderContactPage = (req, res) => {
    res.render('contact');
};

exports.renderTrainingPage = (req, res) => {
    res.render('training');
};

exports.renderPaperGenerationPage = (req, res) => {
    res.render('paper-generation');
};

exports.renderAbcGamesPage = (req, res) => {
    res.render('abc-games');
};
