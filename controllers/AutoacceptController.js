const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const ClassLocation = require('../models/ClassLocation');

// Helper function to calculate distance (using simple proximity)
function isWithinRange(lat1, lon1, lat2, lon2, threshold = 0.0005) {
  const latDiff = Math.abs(lat1 - lat2);
  const lonDiff = Math.abs(lon1 - lon2);
  return latDiff <= threshold && lonDiff <= threshold;
}

exports.autoMarkAttendance = async (req, res) => {
  try {
    const { studentName, collegeId, latitude, longitude } = req.body;

    if (!studentName || !collegeId || !latitude || !longitude) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get student class
    const student = await Student.findOne({ collegeId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Get classroom coordinates
    const classRoom = await ClassLocation.findOne({ className: student.class });
    if (!classRoom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    // Compare location
    const isPresent = isWithinRange(
      latitude,
      longitude,
      classRoom.latitude,
      classRoom.longitude
    );

    const status = isPresent ? 'Approved' : 'Rejected';

    // Save attendance
    const attendance = new Attendance({
      studentName,
      collegeId,
      latitude,
      longitude,
      timestamp: new Date().toISOString(),
      status,
    });

    await attendance.save();

    res.status(201).json({
      message: `Attendance ${status.toLowerCase()}`,
      attendance,
    });
  } catch (error) {
    console.error('Auto attendance error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
