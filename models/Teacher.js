const mongoose = require('mongoose');

// Define the teacher schema
const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Name is a required field
        trim: true       // Trims any extra spaces before/after the name
    },
    age: {
        type: Number,
        required: true,  // Age is a required field
        min: [0, 'Age cannot be negative'] // Age must be greater than or equal to 0
    },
    subject: {
        type: String,
        required: true,  // Subject is a required field
        trim: true       // Trim spaces from the subject field
    },
    experienceYears: {
        type: Number,
        required: true,  // Experience years is required
        min: [0, 'Experience years cannot be negative'] // Ensure experience is not negative
    },
    createdAt: {
        type: Date,
        default: Date.now // Sets the default creation date to now
    }
});

// Create the Teacher model from the schema
const Teacher = mongoose.model('Teacher', teacherSchema);

// Export the model so it can be used in other files
module.exports = Teacher;
