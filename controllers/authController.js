const Student = require('../models/Student');
const bcrypt = require('bcrypt');

// Student Signup
exports.signupStudent = async (req, res) => {
  try {
    const studentData = {
      ...req.body,
      status: 'Pending', 
    };
    const student = await Student.create(studentData);
    res.status(201).json({
      success: true,
      message: 'Student registered. Awaiting teacher approval.',
      studentId: student._id,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Student Login
exports.loginStudent = async (req, res) => {
  const { collegeId, password } = req.body;
  try {
    if (!collegeId || !password) {
      return res.status(400).json({ success: false, message: 'College ID and password are required' });
    }

    const student = await Student.findOne({ collegeId });
    if (!student) {
      return res.status(401).json({ success: false, message: 'Invalid credentials (college ID not found)' });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials (password mismatch)' });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      collegeId: student.collegeId,
      studentName: student.name,
      status: student.status, 
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get All Students 
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

//get all pending student
exports.getPendingStudents = async (req, res) => {
  try {
    const pending = await Student.find({ status: 'Pending' });
    res.status(200).json({ success: true, data: pending });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
