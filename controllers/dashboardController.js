const Student = require('../models/Student'); 
const Teacher = require('../models/Teacher'); 
const User = require('../models/Admin'); 

// Get dashboard data
exports.getDashboardPage = async (req, res) => {
    try {
        // Fetch total number of students
        const totalStudents = await Student.countDocuments();

        // Fetch total number of teachers
        const totalTeachers = await Teacher.countDocuments();

        // Fetch total number of users (admin, staff, etc.)
        const totalUsers = await User.countDocuments();

        // Example of additional stats (e.g., recent student signups)
        const recentStudents = await Student.find().sort({ createdAt: -1 }).limit(5); // Get the 5 most recent students

        // Render the dashboard with the fetched data
        res.render('dashboard');
    } catch (err) {
        console.error('Error fetching dashboard data:', err);
        res.status(500).send('Error fetching dashboard data');
    }
};
