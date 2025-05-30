const express = require('express');
const { signupStudent, loginStudent,getAllStudents,getPendingStudents } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signupStudent);
router.post('/login', loginStudent);
router.get('/students', getAllStudents);
router.get('/pending', getPendingStudents);

module.exports = router;
