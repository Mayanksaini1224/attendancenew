const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

exports.getAttendanceByClassAndTime = async (req, res) => {
  try {
    const { classRoom, startTime, endTime } = req.body; // Changed from req.query

    if (!classRoom || !startTime || !endTime) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    const studentsInClass = await Student.find({ class: classRoom });
    const collegeIds = studentsInClass.map(s => s.collegeId);

    const attendances = await Attendance.find({
      collegeId: { $in: collegeIds },
      createdAt: {
        $gte: new Date(startTime),
        $lte: new Date(endTime),
      },
    });

    return res.status(200).json({ attendances });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
