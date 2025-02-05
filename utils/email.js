const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure transporter for sending emails securely
const transporter = nodemailer.createTransport({
    host: 'smtp.privateemail.com',
    port: 465, // Use 465 for SSL/TLS encryption
    secure: true, // SSL encryption enabled
    auth: {
      user: process.env.EMAIL, // Load securely from environment variables
      pass: process.env.PASSWORD, // Load securely from environment variables
    },
  });

module.exports = transporter;
