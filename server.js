const express = require('express');
const { MongoClient } = require('mongodb'); // Use MongoDB driver
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
const mongoUri = process.env.MONGO_URI;
let db; // Will hold the connected database instance
let client; // MongoDB client instance

// MongoDB Connection
MongoClient.connect(mongoUri)
  .then(client => {
    console.log('Connected to MongoDB');
    
    const usersDb = client.db('Users');
    const sessionsDb = client.db('Sessions');
    const subscriptionsDb = client.db('Subscriptions');
    const questionsDb = client.db('Class_1');

    // Store the database instances in app.locals for access in routes
    app.locals.usersDb = usersDb;
    app.locals.sessionsDb = sessionsDb;
    app.locals.subscriptionsDb = subscriptionsDb;
    app.locals.questionsDb = questionsDb;

  })
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: mongoUri,
        dbName: 'Sessions',
        collectionName: 'Customers',
        ttl: 4 * 24 * 60 * 60,
    }),
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 4 * 24 * 60 * 60 * 1000,
        sameSite: 'lax',
    }
}));


// Set view engine (if using EJS templates)
app.set('view engine', 'ejs');

// Pass `db` to routes for database interactions
require('./routes/routes')(app, db); // Pass `db` to routes

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Closing MongoDB connection');
    await client.close();
    process.exit(0);
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
