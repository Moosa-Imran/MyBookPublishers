const Student = require('../models/Student');

// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).send('Error fetching students');
    }
};


// Render add student page
exports.getAddStudentPage = async (req, res) => {
    res.render('addStudent');
};


// Function to handle adding a new student
exports.AddStudent = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            email,
            admissionDate,
            rollNo,
            class: studentClass,
            gender,
            parentName,
            parentMobileNumber,
            dob,
            address,
        } = req.body;

        const newStudent = new Student({
            firstName,
            lastName,
            email,
            admissionDate,
            rollNo,
            class: studentClass,
            gender,
            parentName,
            parentMobileNumber,
            dob,
            address,
        });

        await newStudent.save();

        res.status(201).json({
            message: 'Student added successfully!',
            student: newStudent,
        });
    } catch (error) {
        next(error); // Pass the error to the centralized error middleware
    }
};



// Get a student by ID
exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).send('Student not found');
        }
        res.json(student);
    } catch (err) {
        res.status(500).send('Error fetching student');
    }
};

// Add a new student
exports.addStudent = async (req, res) => {
    const { name, age, grade } = req.body;

    try {
        const newStudent = new Student({ name, age, grade });
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(500).send('Error adding student');
    }
};

// Update student
exports.updateStudent = async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedStudent) {
            return res.status(404).send('Student not found');
        }
        res.json(updatedStudent);
    } catch (err) {
        res.status(500).send('Error updating student');
    }
};

// Delete student
exports.deleteStudent = async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        if (!deletedStudent) {
            return res.status(404).send('Student not found');
        }
        res.json({ message: 'Student deleted' });
    } catch (err) {
        res.status(500).send('Error deleting student');
    }
};
