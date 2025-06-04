import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder, RefreshCw, Upload } from 'react-feather';
import axios from 'axios';
import DocumentList from '../../components/documents/DocumentList';

const PersonalFiles = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchDocuments();
  }, []);
  
  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/api/documents/personal/');
      setDocuments(response.data);
    } catch (err) {
      console.error('Error fetching personal documents:', err);
      if (err.response && err.response.status === 500) {
        setError('Database initialization required. Please contact the administrator to run migrations.');
      } else {
        setError('Failed to load documents. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleView = (document) => {
    setSelectedDocument(document);
    setShowViewModal(true);
  };
  
  const handleEdit = (document) => {
    // Navigate to edit page or open edit modal
    navigate(`/personal/edit/${document.id}`);
  };
  
  const handleShare = (document) => {
    setSelectedDocument(document);
    setShowShareModal(true);
  };
  
  const handleArchive = async (document) => {
    setSelectedDocument(document);
    setShowArchiveModal(true);
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
    navigate('/personal/upload');
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
  
  // Share document modal
  const ShareDocumentModal = () => {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await axios.get('/api/users/');
          setUsers(response.data);
        } catch (err) {
          console.error('Error fetching users:', err);
        } finally {
          setLoadingUsers(false);
        }
      };
      
      fetchUsers();
    }, []);
    
    const handleShareSubmit = async () => {
      try {
        await axios.post(`/api/documents/${selectedDocument.id}/share/`, {
          user_ids: selectedUsers
        });
        
        setShowShareModal(false);
        alert('Document shared successfully');
        fetchDocuments(); // Refresh documents list
      } catch (err) {
        console.error('Error sharing document:', err);
        alert('Failed to share document. Please try again later.');
      }
    };
    
    const toggleUserSelection = (userId) => {
      if (selectedUsers.includes(userId)) {
        setSelectedUsers(selectedUsers.filter(id => id !== userId));
      } else {
        setSelectedUsers([...selectedUsers, userId]);
      }
    };
    
    if (!selectedDocument) return null;
    
    return (
      <div className="fixed inset-0 bg-secondary-900 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-screen overflow-hidden flex flex-col">
          <div className="p-4 border-b border-secondary-200 flex justify-between items-center">
            <h2 className="text-lg font-medium">Share Document</h2>
            <button 
              onClick={() => setShowShareModal(false)}
              className="text-secondary-500 hover:text-secondary-700"
            >
              &times;
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-auto">
            <p className="mb-4">Sharing: <strong>{selectedDocument.title}</strong></p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Select users to share with:
              </label>
              
              {loadingUsers ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
              ) : (
                <div className="border border-secondary-300 rounded-md max-h-60 overflow-y-auto">
                  {users.length === 0 ? (
                    <p className="p-4 text-secondary-500">No users available</p>
                  ) : (
                    <ul className="divide-y divide-secondary-200">
                      {users.map(user => (
                        <li key={user.id} className="p-3 hover:bg-secondary-50">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => toggleUserSelection(user.id)}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                            />
                            <span>
                              {user.first_name} {user.last_name} ({user.username})
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="p-4 border-t border-secondary-200 flex justify-end">
            <button
              className="btn btn-secondary mr-2"
              onClick={() => setShowShareModal(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleShareSubmit}
              disabled={selectedUsers.length === 0 || loadingUsers}
            >
              Share
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Archive document modal
  const ArchiveDocumentModal = () => {
    const [archives, setArchives] = useState([]);
    const [selectedArchive, setSelectedArchive] = useState('');
    const [loadingArchives, setLoadingArchives] = useState(true);
    
    useEffect(() => {
      const fetchArchives = async () => {
        try {
          const response = await axios.get('/api/archives/');
          setArchives(response.data);
          if (response.data.length > 0) {
            setSelectedArchive(response.data[0].id);
          }
        } catch (err) {
          console.error('Error fetching archives:', err);
        } finally {
          setLoadingArchives(false);
        }
      };
      
      fetchArchives();
    }, []);
    
    const handleArchiveSubmit = async () => {
      try {
        await axios.post(`/api/documents/${selectedDocument.id}/archive/`, {
          archive_id: selectedArchive
        });
        
        setShowArchiveModal(false);
        alert('Document archived successfully');
        fetchDocuments(); // Refresh documents list
      } catch (err) {
        console.error('Error archiving document:', err);
        alert('Failed to archive document. Please try again later.');
      }
    };
    
    if (!selectedDocument) return null;
    
    return (
      <div className="fixed inset-0 bg-secondary-900 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-screen overflow-hidden flex flex-col">
          <div className="p-4 border-b border-secondary-200 flex justify-between items-center">
            <h2 className="text-lg font-medium">Archive Document</h2>
            <button 
              onClick={() => setShowArchiveModal(false)}
              className="text-secondary-500 hover:text-secondary-700"
            >
              &times;
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-auto">
            <p className="mb-4">Archiving: <strong>{selectedDocument.title}</strong></p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Select archive location:
              </label>
              
              {loadingArchives ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
              ) : (
                <select
                  value={selectedArchive}
                  onChange={(e) => setSelectedArchive(e.target.value)}
                  className="form-input"
                >
                  {archives.length === 0 ? (
                    <option value="" disabled>No archives available</option>
                  ) : (
                    archives.map(archive => (
                      <option key={archive.id} value={archive.id}>
                        {archive.name} ({archive.location})
                      </option>
                    ))
                  )}
                </select>
              )}
            </div>
          </div>
          
          <div className="p-4 border-t border-secondary-200 flex justify-end">
            <button
              className="btn btn-secondary mr-2"
              onClick={() => setShowArchiveModal(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleArchiveSubmit}
              disabled={!selectedArchive || loadingArchives}
            >
              Archive
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-secondary-900">Personal Files</h1>
        <div className="flex space-x-2">
          <button
            className="btn btn-secondary flex items-center"
            onClick={fetchDocuments}
          >
            <RefreshCw size={16} className="mr-1" />
            <span>Refresh</span>
          </button>
          
          <button
            className="btn btn-primary flex items-center"
            onClick={handleUpload}
          >
            <Upload size={16} className="mr-1" />
            <span>Upload</span>
          </button>
        </div>
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
        canEdit={true}
        canDelete={true}
        canShare={true}
        canArchive={true}
      />
      
      {showViewModal && <ViewDocumentModal />}
      {showShareModal && <ShareDocumentModal />}
      {showArchiveModal && <ArchiveDocumentModal />}
    </div>
  );
};

export default PersonalFiles; 