const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const { verifyToken, authorizeRole } = require('../../../middleware/auth.middleware');

// Protect all routes with auth and STUDENT role
router.use(verifyToken, authorizeRole(['STUDENT', 'SUPER_ADMIN']));

router.get('/profile', studentController.getProfile);
router.post('/profile', studentController.updateProfile);

module.exports = router;
