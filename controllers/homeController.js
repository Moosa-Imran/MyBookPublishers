// Render Home Pages
exports.renderHomePage = (req, res) => {
    res.render('index');
};

exports.renderELearningPage = (req, res) => {
    res.render('e-learning');
};

exports.renderTrainingPage = (req, res) => {
    res.render('training');
};

exports.renderPaperGenerationPage = (req, res) => {
    res.render('paper-generation');
};

exports.renderEduGames = (req, res) => {
    res.render('edu-games');
};

exports.renderEnglishGames = (req, res) => {
    res.render('english-games');
}

exports.renderMathGames = (req, res) => {
    res.render('math-games');
};

exports.renderUrduGames = (req, res) => {
    res.render('urdu-games');
};

exports.renderAbcTracing = (req, res) => {
    res.render('abc-tracing');
};

exports.renderAlphabetGame = (req, res) => {
    res.render('alphabet-game');
};

exports.renderObjectsGame = (req, res) => {
    res.render('objects-game');
};

exports.renderOrganizeGame = (req, res) => {
    res.render('organize-game');
};

exports.renderDrawAlphabetsGame = (req, res) => {
    res.render('drawAlphabets-game');
}

exports.renderLetterGame = (req, res) => {
    res.render('letter-game');
}

exports.renderNumberTracingGame = (req, res) => {
    res.render('number-tracing-game');
}

exports.renderMatchCountGame = (req, res) => {
    res.render('matchCounting-game');
}

exports.renderHowMany = (req, res) => {
    res.render('howMany-game');
}

exports.renderCountingGame = (req, res) => {
    res.render('counting-game');
}
exports.renderFamilyMatchingGame = (req, res) => {
    res.render('familyMatching-game');
}

exports.renderAbcGamesPage = (req, res) => {
    res.render('abc-games');
};

