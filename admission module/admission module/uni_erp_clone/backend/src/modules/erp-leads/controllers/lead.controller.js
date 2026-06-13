const leadService = require('../services/lead.service');

class LeadController {
  async createLead(req, res) {
    try {
      const lead = await leadService.createLead(req.body);
      res.status(201).json({ success: true, lead });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getLead(req, res) {
    try {
      const lead = await leadService.getLeadById(req.params.id);
      if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
      res.status(200).json({ success: true, lead });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getLeads(req, res) {
    try {
      const leads = await leadService.getLeads();
      res.status(200).json({ success: true, leads });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async approveLead(req, res) {
    try {
      const adminId = req.user ? req.user.id : null;
      const result = await leadService.approveLead(req.params.id, adminId, req.ip);
      res.status(200).json({ success: true, result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updatePayment(req, res) {
    try {
      const adminId = req.user ? req.user.id : null;
      const payment = await leadService.updatePaymentStatus(req.params.id, req.body.status, adminId, req.ip);
      res.status(200).json({ success: true, payment });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new LeadController();