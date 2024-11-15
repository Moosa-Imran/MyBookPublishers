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


// Route to generate a PDF paper
router.get('/generate-paper', async (req, res) => {
    const questionsDb = req.app.locals.questionsDb;
    const { schoolName, testName, class: classValue, subject, numberOfQuestions, difficulty } = req.query;
    const doc = new PDFDocument({ margin: 50 });
    const filename = 'Exam_Paper.pdf';
    const filePath = path.join(__dirname, 'public', 'downloads', filename);

    try {
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/pdf');

        // Fetch the specified number of questions from the selected subject collection
        const paperData = await questionsDb.collection(subject).aggregate([
            { $match: { difficulty } },
            { $sample: { size: parseInt(numberOfQuestions) } }
        ]).toArray();

        if (!paperData.length) {
            return res.status(404).json({ message: 'No data found to generate the paper.' });
        }

        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        // Main Header Box without Shading
        doc.rect(50, 50, 500, 140).lineWidth(2).stroke();
        doc.font('Times-Bold').fontSize(20)
            .text('My Online Prep', 55, 60, { align: 'center', width: 490, underline: true });

        // Test and Grade Details
        doc.font('Times-Bold').fontSize(14)
            .text(testName, 55, 95, { align: 'left' })
            .text(`${classValue} - ${subject.charAt(0).toUpperCase() + subject.slice(1)}`, 400, 95, { align: 'right', width: 140 });

        // Description Text
        doc.font('Times-Roman').fontSize(11)
            .text('Objective = 10 MCQs (10×1.5=15 Marks)   Time = 1 Hour 30 Minutes',
                55, 125, { align: 'center', width: 490 });

        // School Information
        doc.font('Times-Bold').fontSize(10)
            .text(`School Name: ${schoolName}`, 55, 155, { align: 'left', underline: true });

        // Student Info
        const yPosition = 175;
        doc.font('Times-Roman').fontSize(10)
            .text('Student Name : _____________________ ', 55, yPosition)
            .text('Roll Number : ___________ ', 250, yPosition)
            .text('Section : _________', 400, yPosition);

        // Separator Line Before Objective Section
        doc.moveTo(50, 200).lineTo(550, 200).stroke();

        // OBJECTIVE PART Header with Shaded Background
        doc.rect(50, 205, 500, 20).fillAndStroke("#f0f0f0", "#000");
        doc.font('Times-Bold').fontSize(12)
            .fillColor("#000")
            .text('OBJECTIVE PART (MCQs)', 55, 210, { align: 'center', width: 490 });

        // Questions
        let y = 240; // Starting y position for questions

        paperData.forEach((item, index) => {
            // Check if the current y position exceeds the page height
            if (y > 700) {
                doc.addPage(); // Add a new page
                y = 50; // Set y position closer to the top for a new page without extra margin
            }

            // Question Text
            doc.font('Times-Bold').fontSize(11)
                .text(`Q${index + 1}. ${item.question}`, 55, y, { align: 'left', width: 450 });
            y += 18; // Move y down for the options

            // Options with Indentation
            doc.font('Times-Roman').fontSize(11)
                .text(`(a) ${item.opta}`, 75, y)
                .text(`(b) ${item.optb}`, 75, y + 15)
                .text(`(c) ${item.optc}`, 75, y + 30)
                .text(`(d) ${item.optd}`, 75, y + 45);

            y += 60; // Adjust spacing for the next question to control the gap
        });

        doc.end();

        writeStream.on('finish', () => {
            res.download(filePath, filename, (err) => {
                if (err) {
                    console.error('Error downloading the file:', err);
                    res.status(500).send('Error downloading the file');
                }
            });
        });
    } catch (error) {
        console.error('Error generating PDF paper:', error);
        res.status(500).send('Error generating PDF paper');
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
