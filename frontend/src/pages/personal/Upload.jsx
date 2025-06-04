import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'react-feather';
import axios from 'axios';
import FileUpload from '../../components/common/FileUpload';

const PersonalUpload = () => {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        const response = await axios.get('/api/document-types/');
        setDocumentTypes(response.data);
        if (response.data.length > 0) {
          setSelectedDocumentType(response.data[0].id);
        }
      } catch (err) {
        console.error('Error fetching document types:', err);
        if (err.response && err.response.status === 500) {
          setError('Database initialization required. Please contact the administrator to run migrations.');
        } else {
          setError('Failed to load document types. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocumentTypes();
  }, []);
  
  const handleUploadSuccess = (uploadedDocuments) => {
    // Show success message
    alert(`Successfully uploaded ${uploadedDocuments.length} document(s)`);
    
    // Redirect to personal files page
    navigate('/personal/files');
  };
  
  const handleBack = () => {
    navigate('/personal/files');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button
          className="mr-2 text-secondary-500 hover:text-primary-500"
          onClick={handleBack}
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-secondary-900">Upload Personal Files</h1>
      </div>
      
      {error ? (
        <div className="bg-danger-50 border-l-4 border-danger-500 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-danger-700">{error}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="card">
            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Document Type
              </label>
              <select
                value={selectedDocumentType}
                onChange={(e) => setSelectedDocumentType(e.target.value)}
                className="form-input"
                disabled={loading}
              >
                {loading ? (
                  <option value="" disabled>Loading document types...</option>
                ) : documentTypes.length === 0 ? (
                  <option value="" disabled>No document types available</option>
                ) : (
                  documentTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))
                )}
              </select>
              <p className="mt-1 text-xs text-secondary-500">
                Select a document type for the files you are uploading
              </p>
            </div>
            
            <FileUpload
              url="/api/documents/"
              isPersonal={true}
              documentType={selectedDocumentType}
              onSuccess={handleUploadSuccess}
              maxFiles={5}
            />
          </div>
          
          <div className="bg-secondary-50 p-4 rounded-lg border border-secondary-200">
            <h2 className="font-medium mb-2">Upload Guidelines</h2>
            <ul className="list-disc pl-5 text-sm text-secondary-600 space-y-1">
              <li>Supported file formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG</li>
              <li>You can upload up to 5 files at once</li>
              <li>Make sure your files don't contain sensitive personal information</li>
              <li>All uploaded files will be available in your personal files section</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalUpload; 