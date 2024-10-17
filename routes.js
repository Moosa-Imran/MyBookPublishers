const express = require('express');
const router = express.Router();


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


module.exports = router;
