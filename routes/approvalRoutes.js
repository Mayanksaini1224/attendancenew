const express = require('express');
const router = express.Router();
const approvalController = require('../controllers/approvalController');

router.put('/update-status', approvalController.updateApprovalStatus);

module.exports = router;
