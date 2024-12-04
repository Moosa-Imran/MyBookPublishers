const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Route for rendering all students page
// router.get('/', studentController.getAllStudents);

// Route for rendering add new student page
router.get('/addNew', studentController.getAddStudentPage);

router.post('/addNew', studentController.AddStudent);

// Route for viewing a specific student
// router.get('/:id', studentController.getStudentById);

// Route for adding a new student
// router.post('/', studentController.addStudent);

// Route for updating a student
// router.put('/:id', studentController.updateStudent);

// Route for deleting a student
// router.delete('/:id', studentController.deleteStudent);

module.exports = router;
