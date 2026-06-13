const documentRepository = require('../repositories/document.repository');

class DocumentService {
  async getUserDocuments(userId) {
    return await documentRepository.getDocumentsByUserId(userId);
  }

  async uploadDocument(userId, title, type, fileUrl) {
    return await documentRepository.createDocument({
      userId,
      title,
      type,
      fileUrl
    });
  }
}

module.exports = new DocumentService();
