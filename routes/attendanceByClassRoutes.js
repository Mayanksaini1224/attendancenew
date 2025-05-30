const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceByClassController');

router.post('/attendance-by-class', attendanceController.getAttendanceByClassAndTime); // Changed to POST

module.exports = router;
