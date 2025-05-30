const Student = require('../models/Student');

exports.updateApprovalStatus = async (req, res) => {
  const { collegeId, status } = req.body;

  if (!collegeId || !status) {
    return res.status(400).json({ success: false, message: 'collegeId and status are required' });
  }

  try {
    const student = await Student.findOne({ collegeId });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    if (status === 'Rejected') {
      await Student.deleteOne({ collegeId });
      return res.status(200).json({ success: true, message: 'Student rejected and deleted' });
    } else if (status === 'Approved') {
      student.status = 'Approved';
      await student.save();
      return res.status(200).json({ success: true, message: 'Student approved' });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
