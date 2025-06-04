import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle, AlertTriangle } from 'react-feather';
import axios from 'axios';

const FileUpload = ({ 
  url = '/api/documents/', 
  isPersonal = true,
  documentType = null,
  onSuccess,
  maxFiles = 5,
  maxSize = 1073741824, // 1GB (effectively no limit for most documents)
  acceptedFileTypes = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png']
  }
}) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});
  
  const onDrop = useCallback((acceptedFiles) => {
    // Map dropped files to add preview URL
    const newFiles = acceptedFiles.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    );
    
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: acceptedFileTypes,
    maxFiles,
    maxSize,
  });
  
  const removeFile = (fileToRemove) => {
    setFiles(files.filter(file => file !== fileToRemove));
    // Revoke preview URL to avoid memory leaks
    URL.revokeObjectURL(fileToRemove.preview);
  };
  
  const uploadFiles = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    
    // Initialize progress for each file
    const initialProgress = {};
    files.forEach(file => {
      initialProgress[file.name] = 0;
    });
    setUploadProgress(initialProgress);
    
    // Initialize status for each file
    const initialStatus = {};
    files.forEach(file => {
      initialStatus[file.name] = 'uploading';
    });
    setUploadStatus(initialStatus);
    
    // Upload each file
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name);
      formData.append('is_personal', isPersonal);
      if (documentType) {
        formData.append('document_type', documentType);
      }
      
      try {
        const response = await axios.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: percentCompleted
            }));
          }
        });
        
        setUploadStatus(prev => ({
          ...prev,
          [file.name]: 'success'
        }));
        
        return response.data;
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        
        setUploadStatus(prev => ({
          ...prev,
          [file.name]: 'error'
        }));
        
        return null;
      }
    });
    
    const results = await Promise.all(uploadPromises);
    setUploading(false);
    
    // Call the success callback with successful uploads
    const successfulUploads = results.filter(result => result !== null);
    if (successfulUploads.length > 0 && onSuccess) {
      onSuccess(successfulUploads);
    }
  };
  
  const clearCompletedUploads = () => {
    const completedFiles = files.filter(
      file => uploadStatus[file.name] === 'success' || uploadStatus[file.name] === 'error'
    );
    
    completedFiles.forEach(file => {
      URL.revokeObjectURL(file.preview);
    });
    
    setFiles(files.filter(
      file => uploadStatus[file.name] !== 'success' && uploadStatus[file.name] !== 'error'
    ));
  };
  
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <File className="text-danger-500" />;
      case 'doc':
      case 'docx':
        return <File className="text-primary-500" />;
      case 'xls':
      case 'xlsx':
        return <File className="text-success-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <File className="text-warning-500" />;
      default:
        return <File className="text-secondary-500" />;
    }
  };
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-secondary-300 hover:border-primary-400 hover:bg-secondary-50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-secondary-400" />
        <p className="mt-2 text-sm text-secondary-600">
          {isDragActive
            ? 'Thả tệp tại đây...'
            : 'Kéo & thả tệp vào đây, hoặc nhấp để chọn tệp'}
        </p>
        <p className="mt-1 text-xs text-secondary-500">
          Tối đa {maxFiles} tệp
        </p>
      </div>
      
      {files.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-secondary-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-secondary-900">
                Tệp cần tải lên ({files.length})
              </h3>
              <div className="flex space-x-2">
                {files.some(file => 
                  !uploadStatus[file.name] || uploadStatus[file.name] === 'uploading'
                ) && (
                  <button
                    type="button"
                    onClick={uploadFiles}
                    disabled={uploading}
                    className="btn btn-primary"
                  >
                    {uploading ? 'Đang tải lên...' : 'Tải lên tất cả'}
                  </button>
                )}
                
                {files.some(file => 
                  uploadStatus[file.name] === 'success' || uploadStatus[file.name] === 'error'
                ) && (
                  <button
                    type="button"
                    onClick={clearCompletedUploads}
                    className="btn btn-secondary"
                  >
                    Xóa đã hoàn thành
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <ul className="divide-y divide-secondary-200">
            {files.map((file, index) => (
              <li key={`${file.name}-${index}`} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getFileIcon(file.name)}
                    <div>
                      <p className="text-sm font-medium text-secondary-900">{file.name}</p>
                      <p className="text-xs text-secondary-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {uploadStatus[file.name] === 'success' && (
                      <CheckCircle className="text-success-500" size={18} />
                    )}
                    
                    {uploadStatus[file.name] === 'error' && (
                      <AlertTriangle className="text-danger-500" size={18} />
                    )}
                    
                    {(!uploadStatus[file.name] || uploadStatus[file.name] === 'uploading') && (
                      <button
                        type="button"
                        onClick={() => removeFile(file)}
                        className="text-secondary-400 hover:text-secondary-500"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                </div>
                
                {uploadStatus[file.name] === 'uploading' && (
                  <div className="mt-2">
                    <div className="bg-secondary-200 rounded-full h-2.5 w-full">
                      <div 
                        className="bg-primary-500 h-2.5 rounded-full" 
                        style={{ width: `${uploadProgress[file.name] || 0}%` }}
                      ></div>
                    </div>
                    <p className="mt-1 text-xs text-secondary-500 text-right">
                      {uploadProgress[file.name] || 0}%
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 