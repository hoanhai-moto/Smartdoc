import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'react-feather';
import axios from 'axios';
import DocumentList from '../../components/documents/DocumentList';

const SharedFiles = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  
  useEffect(() => {
    fetchSharedDocuments();
  }, []);
  
  const fetchSharedDocuments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/api/documents/shared/');
      setDocuments(response.data);
    } catch (err) {
      console.error('Error fetching shared documents:', err);
      if (err.response && err.response.status === 500) {
        setError('Database initialization required. Please contact the administrator to run migrations.');
      } else {
        setError('Failed to load shared documents. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleView = (document) => {
    setSelectedDocument(document);
    setShowViewModal(true);
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
        <h1 className="text-2xl font-bold text-secondary-900">Shared With Me</h1>
        <div className="flex space-x-2">
          <button
            className="btn btn-secondary flex items-center"
            onClick={fetchSharedDocuments}
          >
            <RefreshCw size={16} className="mr-1" />
            <span>Refresh</span>
          </button>
        </div>
      </div>
      
      <div className="bg-primary-50 border-l-4 border-primary-500 p-4 mb-4">
        <p className="text-sm text-primary-700">
          This page shows documents that other users have shared with you.
        </p>
      </div>
      
      <DocumentList
        documents={documents}
        loading={loading}
        error={error}
        onView={handleView}
        onDownload={handleDownload}
        canEdit={false}
        canDelete={false}
        canShare={false}
        canArchive={false}
      />
      
      {showViewModal && <ViewDocumentModal />}
    </div>
  );
};

export default SharedFiles; 