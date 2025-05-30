const bcrypt = require('bcrypt');
const Teacher = require('../models/Teacher');

// ✅ Teacher Login
exports.loginTeacher = async (req, res) => {
  let { emailId, password } = req.body;

  try {
    if (!emailId || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    emailId = emailId.toLowerCase().trim();

    const teacher = await Teacher.findOne({ emailId });
    if (!teacher) {
      return res.status(401).json({ success: false, message: 'Invalid credentials (email not found)' });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials (password mismatch)' });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      teacherId: teacher._id, // Can be emailId if needed
      name: teacher.name
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ✅ Teacher Signup
exports.signupTeacher = async (req, res) => {
  let { emailId, password, name } = req.body;

  try {
    if (!emailId || !password || !name) {
      return res.status(400).json({ success: false, message: 'Email, password, and name are required' });
    }

    emailId = emailId.toLowerCase().trim();

    // Optional: Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailId)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    const existingTeacher = await Teacher.findOne({ emailId });
    if (existingTeacher) {
      return res.status(400).json({ success: false, message: 'Teacher already exists' });
    }

    const teacher = new Teacher({ emailId, password, name });
    await teacher.save();

    res.status(201).json({ success: true, message: 'Teacher created' });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ✅ Get All Teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().select('-password'); // Exclude passwords
    res.status(200).json({ success: true, data: teachers });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


//Teacher update
exports.updateProfile = async (req, res) => {
  const { emailId } = req.params; // Identify teacher by emailId in URL param
  const { password, mentor, mentorClass } = req.body;

  try {
    const teacher = await Teacher.findOne({ emailId });
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    if (password) {
      teacher.password = password; // will be hashed by pre-save hook
    }

    if (mentor !== undefined) {
      teacher.mentor = mentor;
    }

    if (mentorClass !== undefined) {
      teacher.mentorClass = mentorClass;
    }

    await teacher.save();

    res.status(200).json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
