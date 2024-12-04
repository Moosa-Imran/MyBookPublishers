const mongoose = require('mongoose');

// Define the student schema
const studentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true, // First name is required
        trim: true       // Trims extra spaces
    },
    lastName: {
        type: String,
        required: true, // Last name is required
        trim: true
    },
    email: {
        type: String,
        required: true, // Email is required
        trim: true,
        unique: true,   // Ensures unique email addresses
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address'] // Email validation
    },
    admissionDate: {
        type: Date,
        required: true,  // Admission date is required
    },
    rollNo: {
        type: Number,
        required: true,  // Roll number is required
        unique: true,    // Ensures unique roll numbers
    },
    class: {
        type: String,
        required: true,  // Class is required
        trim: true
    },
    gender: {
        type: String,
        required: true,  // Gender is required
        enum: ['Male', 'Female'] // Restricts value to Male or Female
    },
    parentName: {
        type: String,
        required: true, // Parent name is required
        trim: true
    },
    parentMobileNumber: {
        type: String,
        required: true, // Parent's mobile number is required
        match: [/^03\d{9}$/, 'Please provide a valid 11-digit Pakistani mobile number starting with 03']
    },
    dob: {
        type: Date,
        required: true, // Date of Birth is required
    },
    address: {
        type: String,
        required: true, // Address is required
        trim: true
    },
    profilePicture: {
        type: String, // Stores the file path of the profile picture
        default: ''   // Default is an empty string
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically sets creation date
    }
});

// Create the Student model from the schema
const Student = mongoose.model('Student', studentSchema);

// Export the model so it can be used in other files
module.exports = Student;
