const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// ✅ Submit Attendance with Approval Check
exports.submitAttendance = async (req, res) => {
  const { studentName, collegeId, latitude, longitude, timestamp, status } = req.body;

  try {
    // 1. Check if student exists
    const student = await Student.findOne({ collegeId });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // 2. Check approval status
    if (student.status !== 'Approved') {
      return res.status(403).json({
        success: false,
        message: 'Awaiting teacher approval to mark attendance',
      });
    }

    // 3. Proceed with attendance save
    const attendance = new Attendance({
      studentName,
      collegeId,
      latitude,
      longitude,
      timestamp,
      status,
    });

    await attendance.save();
    res.status(201).json({ success: true, message: 'Attendance submitted for approval' });

  } catch (error) {
    console.error('Submit Attendance Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ✅ Get All Attendance Requests
exports.getAttendanceRequests = async (req, res) => {
  try {
    const requests = await Attendance.find();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ✅ Approve or Reject Attendance
exports.updateAttendanceStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    res.status(200).json({ success: true, message: 'Attendance status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ✅ Get All Attendance Records
exports.getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find();
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ✅ Get Attendance by Student College ID
exports.getAttendanceByCollegeId = async (req, res) => {
  try {
    const records = await Attendance.find({ collegeId: req.params.collegeId });
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
