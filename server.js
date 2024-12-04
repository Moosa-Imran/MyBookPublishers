const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const MongoStore = require('connect-mongo');
require('dotenv').config();
const errorHandler = require('./middlewares/errorHandler'); 

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
const mongoUri = process.env.MONGO_URI;
mongoose
    .connect(mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('MongoDB Connection Error:', err));

// Session configuration
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: mongoUri,
            collectionName: 'Sessions',
            ttl: 4 * 24 * 60 * 60,
        }),
        cookie: {
            secure: true,
            httpOnly: true,
            maxAge: 4 * 24 * 60 * 60 * 1000,
            sameSite: 'lax',
        },
    })
);

// Set view engine (if using EJS templates)
app.set('view engine', 'ejs');

// Import routes setup
require('./routes/routes')(app);

// Add error handler middleware here (after routes)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});