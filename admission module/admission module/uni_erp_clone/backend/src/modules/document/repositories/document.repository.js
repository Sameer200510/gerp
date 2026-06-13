const prisma = require("../../../config/prisma");

class DocumentRepository {
  async getDocumentsByUserId(userId) {
    return await prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async createDocument(data) {
    return await prisma.document.create({
      data,
    });
  }
}

module.exports = new DocumentRepository();
