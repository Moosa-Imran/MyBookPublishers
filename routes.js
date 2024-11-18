const express = require('express');
const path = require('path');
const router = express.Router();
const PDFDocument = require('pdfkit');
const fs = require('fs');

// Protected Route
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next(); 
    } else {
        return res.redirect('/');
    }
}


// Route for Storing Email Subscription 
router.post('/subscribe', async (req, res) => {
    const email = req.body.email;
    const subscriptionsDb = req.app.locals.subscriptionsDb; 

    try {
        // Check if the email already exists in the Customers collection
        const existingEmail = await subscriptionsDb.collection('Customers').findOne({ email });

        if (existingEmail) {
            return res.status(400).json({ message: 'Email already subscribed.' });
        }

        // Add new email to the Customers collection
        await subscriptionsDb.collection('Customers').insertOne({ 
            email, 
            subscribedAt: new Date() // Store current date and time
        });

        res.status(201).json({ message: 'Subscription successful!' });
    } catch (error) {
        console.error('Error subscribing email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route for Sign Up
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const usersDb = req.app.locals.usersDb;

    try {
        // Check if the email already exists in the Customers collection
        const existingUser = await usersDb.collection('Customers').findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered.' });
        }

        // Insert new user into the Customers collection
        await usersDb.collection('Customers').insertOne({
            name,
            email,
            password, 
            registeredAt: new Date(),
        });

        res.status(201).json({ message: 'Sign up successful! Welcome to My Book Publishers.' });
    } catch (error) {
        console.error('Error during sign-up:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Route for Sign In
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    const usersDb = req.app.locals.usersDb;

    try {
        // Find user in the database
        const user = await usersDb.collection('Customers').findOne({ email });

        // Check if user exists and password matches (this example doesn't use hashed passwords)
        if (!user || user.password !== password) {
            return res.status(400).json({ message: 'Invalid Email or Password.' });
        }

        // Set user data in session
        req.session.user = {
            id: user._id,
            email: user.email,
            name: user.name
        };

        res.status(200).json({ message: 'Login successful!', user: req.session.user });
    } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


// Route to generate a paper and send questions as a response
router.get('/generate-paper', async (req, res) => {
    const questionsDb = req.app.locals.questionsDb;
    const { subject, difficulty } = req.query;  // difficulty will be an object

    // Extract difficulty levels and their respective counts
    const { Level_1, Level_2, Level_3, Level_4 } = difficulty;

    try {
        // Initialize an empty array to hold the fetched questions
        let allQuestions = [];

        // Fetch questions for Level_1
        const level1Questions = await questionsDb.collection(subject).aggregate([
            { $match: { difficulty: "Level_1" } },
            { $sample: { size: parseInt(Level_1) } } // Get the number of Level_1 questions
        ]).toArray();
        allQuestions = allQuestions.concat(level1Questions); // Add to the main array

        // Fetch questions for Level_2
        const level2Questions = await questionsDb.collection(subject).aggregate([
            { $match: { difficulty: "Level_2" } },
            { $sample: { size: parseInt(Level_2) } } // Get the number of Level_2 questions
        ]).toArray();
        allQuestions = allQuestions.concat(level2Questions); // Add to the main array

        // Fetch questions for Level_3
        const level3Questions = await questionsDb.collection(subject).aggregate([
            { $match: { difficulty: "Level_3" } },
            { $sample: { size: parseInt(Level_3) } } // Get the number of Level_3 questions
        ]).toArray();
        allQuestions = allQuestions.concat(level3Questions); // Add to the main array

        // Fetch questions for Level_4
        const level4Questions = await questionsDb.collection(subject).aggregate([
            { $match: { difficulty: "Level_4" } },
            { $sample: { size: parseInt(Level_4) } } // Get the number of Level_4 questions
        ]).toArray();
        allQuestions = allQuestions.concat(level4Questions); // Add to the main array

        // Check if any questions were fetched
        if (allQuestions.length === 0) {
            return res.status(404).json({ message: 'No questions found for the specified parameters.' });
        }

        // Respond with the generated questions
        res.json({ questions: allQuestions });
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).send('Error generating paper');
    }
});




// Route for LogOut
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed. Please try again later.' });
        }
        res.clearCookie('connect.sid'); // This clears the session cookie
        res.status(200).json({ message: 'Logout successful!' });
    });
});

// Protected Routes
router.get('/dashboard', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'dashboard.html'));
});


module.exports = router;
