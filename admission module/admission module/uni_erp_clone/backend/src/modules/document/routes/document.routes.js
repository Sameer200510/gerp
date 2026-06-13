const express = require('express');
const router = express.Router();
const documentController = require('../controllers/document.controller');
const { verifyToken, authorizeRole } = require('../../../middleware/auth.middleware');

router.use(verifyToken);

// Students can manage their own documents
router.get('/my-documents', authorizeRole(['STUDENT']), documentController.getMyDocuments);
router.post('/upload', authorizeRole(['STUDENT']), documentController.uploadDocument);

module.exports = router;
