const express = require('express');
const router = express.Router();
const AutoaceptController = require('../controllers/AutoacceptController');

router.post('/auto-attendance', AutoaceptController.autoMarkAttendance);

module.exports = router;
