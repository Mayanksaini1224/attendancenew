const express = require('express');
const router = express.Router();
const classLocationController = require('../controllers/classlocationController');

router.post('/set', classLocationController.setClassLocation);
router.get('/:className', classLocationController.getClassLocation);
router.get('/', classLocationController.getAllClassLocations); // optional

module.exports = router;
