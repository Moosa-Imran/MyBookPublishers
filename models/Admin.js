const mongoose = require('mongoose');

// Define schema for admin users
const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, 
    password: { type: String, required: true }, 
    role: { type: String, default: 'admin', required: true } 
}, {
    timestamps: true 
});

// Create Admin model and specify the collection name
module.exports = mongoose.model('Admin', adminSchema, 'admins');