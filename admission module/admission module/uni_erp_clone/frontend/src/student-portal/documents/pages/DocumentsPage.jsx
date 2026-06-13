import React, { useEffect, useState } from "react";
import { documentService } from "../services/document.service";
import { Upload, File, CheckCircle2, Clock } from "lucide-react";
import { useForm } from "react-hook-form";

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm();
  const [uploading, setUploading] = useState(false);

  const fetchDocs = async () => {
    try {
      const data = await documentService.getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const onUpload = async (data) => {
    try {
      setUploading(true);
      // Simulate file upload logic by just passing the dummy URL
      const dummyUrl = `https://storage.university.edu/${Date.now()}_${data.title.replace(/\s+/g, "_")}.pdf`;
      await documentService.uploadDocument(data.title, data.type, dummyUrl);
      reset();
      fetchDocs();
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Upload Document
          </h2>
          <p className="text-sm text-gray-500">
            Submit required documents for your admission.
          </p>
        </div>
        <form onSubmit={handleSubmit(onUpload)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Title
              </label>
              <input
                {...register("title", { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. High School Transcript"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Type
              </label>
              <select
                {...register("type", { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="TRANSCRIPT">Transcript</option>
                <option value="ID_PROOF">ID Proof</option>
                <option value="PHOTO">Photograph</option>
                <option value="CERTIFICATE">Certificate</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? "Uploading..." : "Upload Simulation"}
          </button>
        </form>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          My Documents
        </h2>
        {loading ? (
          <div>Loading documents...</div>
        ) : documents.length === 0 ? (
          <div className="text-gray-500 text-sm text-center py-8">
            No documents uploaded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-medium">Document</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date Uploaded</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800 flex items-center">
                      <File className="h-4 w-4 mr-2 text-gray-400" />
                      {doc.title}
                    </td>
                    <td className="px-6 py-4">{doc.type}</td>
                    <td className="px-6 py-4">
                      {doc.status === "APPROVED" ? (
                        <span className="flex items-center text-green-600">
                          <CheckCircle2 className="h-4 w-4 mr-1" /> Approved
                        </span>
                      ) : (
                        <span className="flex items-center text-amber-600">
                          <Clock className="h-4 w-4 mr-1" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsPage;
