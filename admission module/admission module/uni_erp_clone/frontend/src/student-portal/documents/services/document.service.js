export const documentService = {
  getDocuments: async () => {
    const response = await api.get("/document/my-documents");
    return response.data.documents;
  },

  uploadDocument: async (title, type, fileUrl) => {
    const response = await api.post("/document/upload", {
      title,
      type,
      fileUrl,
    });
    return response.data.document;
  },
};
