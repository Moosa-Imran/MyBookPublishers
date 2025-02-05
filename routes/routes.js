const checkLogin = require('../middlewares/checkLogin'); 
const homeRoutes = require('./homeRoutes');
const authRoutes = require('./authRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const jobsRoutes = require('./jobsRoutes');

module.exports = (app) => {
    app.use('/', homeRoutes);
    app.use('/auth', authRoutes);
    app.use('/jobs', jobsRoutes);
    app.use('/dashboard', checkLogin, dashboardRoutes);
};
