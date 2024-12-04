const checkLogin = (req, res, next) => {
    // Check if the user is logged in (based on your session setup)
    if (req.session && req.session.userId) {
        // If the user is logged in, allow them to proceed to the next route
        return next();
    }
    
    // If the user is not logged in, redirect them to the login page
    res.redirect('/auth/login');
};

module.exports = checkLogin;
