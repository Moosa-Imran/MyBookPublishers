const User = require('../models/Admin'); 

// Render login page
exports.renderLoginPage = (req, res) => {
    if (req.session && req.session.userId) {
        return res.redirect('/dashboard'); 
    }
    res.render('login'); // Render login page
};

// Handle login
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user in the database
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).send('User not found');
        }

        // Compare the passwords (plaintext comparison)
        if (user.password !== password) {
            return res.status(401).send('Invalid credentials');
        }

        // If valid, start a session
        req.session.userId = user._id; // Store user ID in the session
        res.redirect('/dashboard'); // Redirect to the dashboard after login
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Handle logout
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Unable to log out');
        }
        res.redirect('/auth/login');
    });
};
