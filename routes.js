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
    const doc = new PDFDocument({ margin: 50 });
    const filename = 'Exam_Paper.pdf';
    const filePath = path.join(__dirname, 'public', 'downloads', filename); // Path to save the generated PDF

    try {
        // Fetch 10 random questions from the MongoDB collection
        const paperData = await questionsDb.collection('english').aggregate([
            { $sample: { size: 10 } } // Fetch 10 random documents
        ]).toArray();

        if (!paperData.length) {
            return res.status(404).json({ message: 'No data found to generate the paper.' });
        }

        // Pipe the PDF document to a writable stream (save it to file)
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        // Add Header Box
        doc.rect(50, 50, 500, 120) // Adjust height
            .stroke();

        // Add Header Text
        doc.font('Times-Bold')
            .fontSize(18)
            .text('SCHOOL BASED ASSESSMENT 2024-25', 55, 60, { align: 'center', width: 490 });

        doc.font('Times-Bold')
            .fontSize(14)
            .text('First Term', 60, 90, { align: 'left' });

        doc.text('English Grade 8', 450, 90, { align: 'right' });

        doc.font('Times-Roman')
            .fontSize(10)
            .text(
                'Objective = 10 MCQs (10×1.5=15 Marks) and Subjective = 35 Marks, Total = 50 Marks / Time = 1 Hour 30 Minutes',
                55,
                110,
                { align: 'center', width: 490 }
            );

        // Add School Information
        doc.font('Times-Bold')
            .fontSize(10)
            .text('School Name: GGES FAROOQ PURA OLD SHUJABAD ROAD MULTAN (EMIS: 36110088)', 55, 135, {
                align: 'left',
                underline: true,
            });

        doc.font('Times-Roman')
            .fontSize(10)
            .text('Student Name : ___________________________', 55, 155, { align: 'left' });

        doc.text('Roll Number : ___________________________', 320, 155, { align: 'right' });

        doc.text('Section : ___________________________', 55, 175, { align: 'left' });

        // Add Divider Line
        doc.moveTo(50, 185).lineTo(550, 185).stroke();

        // Add Objective Part Title
        doc.font('Times-Bold')
            .fontSize(12)
            .text('OBJECTIVE PART (MCQs)', 55, 195, { align: 'center' });

        // Add Questions
        let y = 215; // Starting position for questions
        paperData.forEach((item, index) => {
            // Check if there's enough space for the next question
            if (y > 700) {
                doc.addPage();
                y = 50; // Reset y for new page
            }

            // Add question number and text
            doc.font('Times-Roman')
                .fontSize(11)
                .text(`Q${index + 1}. ${item.question}`, 55, y, { align: 'left', width: 450 });

            y += 15; // Adjust y for options

            // Add options
            doc.text(`(a) ${item.opta}`, 75, y, { continued: false });
            doc.text(`(b) ${item.optb}`, 75, y + 15, { continued: false });
            doc.text(`(c) ${item.optc}`, 75, y + 30, { continued: false });
            doc.text(`(d) ${item.optd}`, 75, y + 45, { continued: false });

            y += 60; // Add spacing after the question
        });

        // Finalize the PDF and close the stream
        doc.end();

        // Wait for the file to be written before responding with the download
        writeStream.on('finish', () => {
            // Trigger the file download
            res.download(filePath, filename, (err) => {
                if (err) {
                    console.error('Error downloading the file:', err);
                    res.status(500).send('Error generating paper');
                }

                // Optionally, delete the file after it's been sent (to save disk space)
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Error deleting the temporary file:', err);
                    }
                });
            });
        });
    } catch (error) {
        console.error('Error generating paper:', error);
        res.status(500).json({ message: 'Internal server error.' });
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
