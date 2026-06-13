const documentService = require('../services/document.service');

class DocumentController {
  async getMyDocuments(req, res) {
    try {
      const userId = req.user.id;
      const documents = await documentService.getUserDocuments(userId);
      res.status(200).json({ documents });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async uploadDocument(req, res) {
    try {
      const userId = req.user.id;
      const { title, type, fileUrl } = req.body;
      
      if (!title || !type || !fileUrl) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const document = await documentService.uploadDocument(userId, title, type, fileUrl);
      res.status(201).json({ message: 'Document uploaded successfully', document });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new DocumentController();
