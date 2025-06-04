import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Upload } from 'react-feather';
import axios from 'axios';
import DocumentList from '../../components/documents/DocumentList';

const NotarizedRecords = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchNotarizedDocuments();
  }, []);
  
  const fetchNotarizedDocuments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch document types to get the notarized type ID
      const typesResponse = await axios.get('/api/document-types/');
      const notarizedType = typesResponse.data.find(type => type.category === 'notarized');
      
      if (!notarizedType) {
        throw new Error('Notarized record type not found');
      }
      
      // Fetch documents of notarized type
      const response = await axios.get('/api/documents/', {
        params: {
          document_type: notarizedType.id
        }
      });
      
      setDocuments(response.data);
    } catch (err) {
      console.error('Error fetching notarized documents:', err);
      setError('Failed to load notarized documents. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleView = (document) => {
    setSelectedDocument(document);
    setShowViewModal(true);
  };
  
  const handleEdit = (document) => {
    navigate(`/records/notarized/edit/${document.id}`);
  };
  
  const handleShare = async (document) => {
    // Implement share functionality or open share modal
  };
  
  const handleArchive = async (document) => {
    // Implement archive functionality or open archive modal
  };
  
  const handleDownload = async (document) => {
    try {
      const response = await axios.get(`/api/documents/${document.id}/download/`, {
        responseType: 'blob'
      });
      
      // Create a blob URL for the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', document.title);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading document:', err);
      alert('Failed to download document. Please try again later.');
    }
  };
  
  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }
    
    try {
      await axios.delete(`/api/documents/${documentId}/`);
      
      // Update documents list
      setDocuments(documents.filter(doc => doc.id !== documentId));
      
      // Show success message
      alert('Document deleted successfully');
    } catch (err) {
      console.error('Error deleting document:', err);
      alert('Failed to delete document. Please try again later.');
    }
  };
  
  const handleUpload = () => {
    navigate('/records/notarized/upload');
  };
  
  // View document modal
  const ViewDocumentModal = () => {
    if (!selectedDocument) return null;
    
    return (
      <div className="fixed inset-0 bg-secondary-900 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-hidden flex flex-col">
          <div className="p-4 border-b border-secondary-200 flex justify-between items-center">
            <h2 className="text-lg font-medium">{selectedDocument.title}</h2>
            <button 
              onClick={() => setShowViewModal(false)}
              className="text-secondary-500 hover:text-secondary-700"
            >
              &times;
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-auto">
            {selectedDocument.file && (
              <iframe
                src={selectedDocument.file}
                className="w-full h-full border-0"
                title={selectedDocument.title}
              ></iframe>
            )}
          </div>
          
          <div className="p-4 border-t border-secondary-200 flex justify-end">
            <button
              className="btn btn-secondary mr-2"
              onClick={() => setShowViewModal(false)}
            >
              Close
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handleDownload(selectedDocument)}
            >
              Download
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-secondary-900">Notarized Records</h1>
        <div className="flex space-x-2">
          <button
            className="btn btn-secondary flex items-center"
            onClick={fetchNotarizedDocuments}
          >
            <RefreshCw size={16} className="mr-1" />
            <span>Refresh</span>
          </button>
          
          <button
            className="btn btn-primary flex items-center"
            onClick={handleUpload}
          >
            <Upload size={16} className="mr-1" />
            <span>Upload New</span>
          </button>
        </div>
      </div>
      
      <div className="bg-primary-50 border-l-4 border-primary-500 p-4 mb-4">
        <p className="text-sm text-primary-700">
          <strong>Notarized Records</strong> are documents that have been certified by a notary public, 
          confirming that the signatures on the documents are genuine.
        </p>
      </div>
      
      <DocumentList
        documents={documents}
        loading={loading}
        error={error}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onShare={handleShare}
        onArchive={handleArchive}
        onDownload={handleDownload}
      />
      
      {showViewModal && <ViewDocumentModal />}
    </div>
  );
};

export default NotarizedRecords; 