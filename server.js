const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = 3001;
const mongoUri = process.env.MONGO_URI;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files (like HTML, CSS, JS) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: mongoUri,
    dbName: 'Sessions',
    collectionName: 'Customers',
    ttl: 4 * 24 * 60 * 60, // Session TTL
  }),
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 4 * 24 * 60 * 60 * 1000,
    sameSite: 'lax',
  }
}));

// MongoDB Connection
MongoClient.connect(mongoUri)
  .then(client => {
    console.log('Connected to MongoDB');
    
    const usersDb = client.db('Users');
    const sessionsDb = client.db('Sessions');
    const subscriptionsDb = client.db('Subscriptions');
    const questionsDb = client.db('NET');

    // Store the database instances in app.locals for access in routes
    app.locals.usersDb = usersDb;
    app.locals.sessionsDb = sessionsDb;
    app.locals.subscriptionsDb = subscriptionsDb;
    app.locals.questionsDb = questionsDb;

    // Import and use the routes
    const routes = require('./routes');
    app.use('/', routes);
  })
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Google Generative AI Setup
const genAI = new GoogleGenerativeAI({ apiKey: "AIzaSyCWKYbOEAnXoYJA3XiW-VQz_cwNLKOk1Dw" });

// Route to handle chatbot interaction
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  const conversationHistory = req.body.history;

  try {
    // Get the generative model instance
    const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });

    // Start chat and pass conversation history
    const chat = model.startChat({
      history: conversationHistory,
    });

    // Send the user's message and get a response
    const result = await chat.sendMessage(userMessage);
    const botResponse = result.response.text(); // Get the bot's response text

    // Send the response back to the client
    res.json({ botMessage: botResponse });
  } catch (error) {
    console.error('Error from Generative AI:', error);
    res.status(500).json({ error: 'Failed to get a response from the chatbot' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
