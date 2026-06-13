const express = require('express');
const router = express.Router();
const leadController = require('../controllers/lead.controller');

// Middlewares
const { verifyToken, authorizeRole } = require('../../../middleware/auth.middleware');
const validate = require('../../../middleware/validation.middleware');
const { applyLeadValidation, updatePaymentValidation } = require('../validators/lead.validator');
const rateLimit = require('express-rate-limit');

// Rate limiters
const applyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 applications per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many applications from this IP, please try again after 15 minutes.' }
});

// Public endpoints
router.post('/apply', applyLimiter, applyLeadValidation, validate, leadController.createLead);
router.get('/:id', leadController.getLead);

// Admin endpoints
router.use(verifyToken);
router.get('/', authorizeRole('SUPER_ADMIN', 'ADMISSION_OFFICER'), leadController.getLeads);
router.post('/:id/approve', authorizeRole('SUPER_ADMIN', 'ADMISSION_OFFICER'), leadController.approveLead);
router.patch('/:id/payment', authorizeRole('SUPER_ADMIN', 'ADMISSION_OFFICER'), updatePaymentValidation, validate, leadController.updatePayment);

module.exports = router;