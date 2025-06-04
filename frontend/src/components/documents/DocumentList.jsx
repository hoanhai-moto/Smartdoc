import React, { useState } from 'react';
import { 
  Download, Edit, Trash2, Share2, Archive, Eye, 
  Search, Filter, ChevronDown, ChevronUp, ChevronLeft, ChevronRight 
} from 'react-feather';
import { format } from 'date-fns';

const DocumentList = ({ 
  documents = [], 
  loading = false,
  error = null,
  onView,
  onEdit,
  onDelete,
  onShare,
  onArchive,
  onDownload,
  canEdit = true,
  canDelete = true,
  canShare = true,
  canArchive = true,
  itemsPerPage = 10
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updated_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    documentType: '',
    dateRange: {
      from: '',
      to: ''
    }
  });
  
  // Filter documents based on search term and filters
  const filteredDocuments = documents.filter(doc => {
    // Search term filter
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = filters.status ? doc.status === filters.status : true;
    
    // Document type filter
    const matchesType = filters.documentType 
      ? doc.document_type?.id === parseInt(filters.documentType) 
      : true;
    
    // Date range filter
    let matchesDateRange = true;
    if (filters.dateRange.from) {
      const fromDate = new Date(filters.dateRange.from);
      const docDate = new Date(doc.updated_at);
      if (docDate < fromDate) {
        matchesDateRange = false;
      }
    }
    if (filters.dateRange.to) {
      const toDate = new Date(filters.dateRange.to);
      const docDate = new Date(doc.updated_at);
      if (docDate > toDate) {
        matchesDateRange = false;
      }
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesDateRange;
  });
  
  // Sort documents
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    // Handle nested properties
    if (sortBy === 'document_type') {
      aValue = a.document_type?.name || '';
      bValue = b.document_type?.name || '';
    } else if (sortBy === 'uploaded_by') {
      aValue = a.uploaded_by?.username || '';
      bValue = b.uploaded_by?.username || '';
    }
    
    // Handle dates
    if (sortBy === 'created_at' || sortBy === 'updated_at') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  // Pagination
  const totalPages = Math.ceil(sortedDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDocuments = sortedDocuments.slice(startIndex, startIndex + itemsPerPage);
  
  // Handle sort
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };
  
  // Handle selection
  const toggleSelectAll = () => {
    if (selectedDocuments.length === paginatedDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(paginatedDocuments.map(doc => doc.id));
    }
  };
  
  const toggleSelectDocument = (docId) => {
    if (selectedDocuments.includes(docId)) {
      setSelectedDocuments(selectedDocuments.filter(id => id !== docId));
    } else {
      setSelectedDocuments([...selectedDocuments, docId]);
    }
  };
  
  // Handle bulk actions
  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedDocuments.length} document(s)?`)) {
      selectedDocuments.forEach(id => onDelete && onDelete(id));
      setSelectedDocuments([]);
    }
  };
  
  const handleBulkArchive = () => {
    selectedDocuments.forEach(id => onArchive && onArchive(id));
    setSelectedDocuments([]);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (err) {
      return 'Invalid date';
    }
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'badge-success';
      case 'archived':
        return 'badge-info';
      case 'borrowed':
        return 'badge-warning';
      case 'shared':
        return 'badge-info';
      default:
        return 'badge-secondary';
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-danger-50 border-l-4 border-danger-500 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-danger-700">
              Error loading documents: {error}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Search and filter bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400" size={18} />
        </div>
        
        <div className="flex space-x-2">
          <button
            className="btn btn-secondary flex items-center"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Filter size={16} className="mr-1" />
            <span>Filter</span>
          </button>
          
          {selectedDocuments.length > 0 && (
            <div className="flex space-x-2">
              {canDelete && (
                <button
                  className="btn btn-danger flex items-center"
                  onClick={handleBulkDelete}
                >
                  <Trash2 size={16} className="mr-1" />
                  <span>Delete ({selectedDocuments.length})</span>
                </button>
              )}
              
              {canArchive && (
                <button
                  className="btn btn-secondary flex items-center"
                  onClick={handleBulkArchive}
                >
                  <Archive size={16} className="mr-1" />
                  <span>Archive ({selectedDocuments.length})</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Filters panel */}
      {filterOpen && (
        <div className="bg-white p-4 rounded-lg shadow border border-secondary-200">
          <h3 className="text-lg font-medium mb-3">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="form-input"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
                <option value="borrowed">Borrowed</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Document Type
              </label>
              <select
                value={filters.documentType}
                onChange={(e) => setFilters({...filters, documentType: e.target.value})}
                className="form-input"
              >
                <option value="">All Types</option>
                {/* Ideally, these would be dynamically loaded from the backend */}
                <option value="1">Notarized Records</option>
                <option value="2">Certified Copies</option>
                <option value="3">Authenticated Records</option>
                <option value="4">Translated Records</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={filters.dateRange.from}
                  onChange={(e) => setFilters({
                    ...filters, 
                    dateRange: {...filters.dateRange, from: e.target.value}
                  })}
                  className="form-input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={filters.dateRange.to}
                  onChange={(e) => setFilters({
                    ...filters, 
                    dateRange: {...filters.dateRange, to: e.target.value}
                  })}
                  className="form-input"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button 
              className="btn btn-secondary mr-2"
              onClick={() => setFilters({
                status: '',
                documentType: '',
                dateRange: { from: '', to: '' }
              })}
            >
              Reset
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => setFilterOpen(false)}
            >
              Apply
            </button>
          </div>
        </div>
      )}
      
      {/* Documents table */}
      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell w-10">
                <input
                  type="checkbox"
                  checked={
                    paginatedDocuments.length > 0 && 
                    selectedDocuments.length === paginatedDocuments.length
                  }
                  onChange={toggleSelectAll}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                />
              </th>
              <th 
                className="table-header-cell cursor-pointer"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center">
                  <span>Title</span>
                  {sortBy === 'title' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              </th>
              <th 
                className="table-header-cell cursor-pointer"
                onClick={() => handleSort('document_type')}
              >
                <div className="flex items-center">
                  <span>Type</span>
                  {sortBy === 'document_type' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              </th>
              <th 
                className="table-header-cell cursor-pointer"
                onClick={() => handleSort('updated_at')}
              >
                <div className="flex items-center">
                  <span>Last Updated</span>
                  {sortBy === 'updated_at' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              </th>
              <th 
                className="table-header-cell cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  <span>Status</span>
                  {sortBy === 'status' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              </th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {paginatedDocuments.length === 0 ? (
              <tr>
                <td colSpan="6" className="table-cell text-center py-8">
                  <p className="text-secondary-500">No documents found</p>
                </td>
              </tr>
            ) : (
              paginatedDocuments.map(doc => (
                <tr key={doc.id} className="table-row">
                  <td className="table-cell">
                    <input
                      type="checkbox"
                      checked={selectedDocuments.includes(doc.id)}
                      onChange={() => toggleSelectDocument(doc.id)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                    />
                  </td>
                  <td className="table-cell font-medium">{doc.title}</td>
                  <td className="table-cell">{doc.document_type?.name || 'N/A'}</td>
                  <td className="table-cell">{formatDate(doc.updated_at)}</td>
                  <td className="table-cell">
                    <span className={`badge ${getStatusBadgeClass(doc.status)}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onView && onView(doc)}
                        className="text-secondary-500 hover:text-primary-500"
                        title="View"
                      >
                        <Eye size={18} />
                      </button>
                      
                      {canEdit && (
                        <button
                          onClick={() => onEdit && onEdit(doc)}
                          className="text-secondary-500 hover:text-primary-500"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                      )}
                      
                      <button
                        onClick={() => onDownload && onDownload(doc)}
                        className="text-secondary-500 hover:text-primary-500"
                        title="Download"
                      >
                        <Download size={18} />
                      </button>
                      
                      {canShare && (
                        <button
                          onClick={() => onShare && onShare(doc)}
                          className="text-secondary-500 hover:text-primary-500"
                          title="Share"
                        >
                          <Share2 size={18} />
                        </button>
                      )}
                      
                      {canArchive && doc.status !== 'archived' && (
                        <button
                          onClick={() => onArchive && onArchive(doc)}
                          className="text-secondary-500 hover:text-primary-500"
                          title="Archive"
                        >
                          <Archive size={18} />
                        </button>
                      )}
                      
                      {canDelete && (
                        <button
                          onClick={() => onDelete && onDelete(doc)}
                          className="text-secondary-500 hover:text-danger-500"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-secondary-500">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedDocuments.length)} of {sortedDocuments.length} entries
          </div>
          
          <div className="flex space-x-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`btn btn-secondary p-2 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                // Show first page, last page, current page, and pages around current
                return (
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1
                );
              })
              .map((page, index, array) => {
                // Add ellipsis
                const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                const showEllipsisAfter = index < array.length - 1 && array[index + 1] !== page + 1;
                
                return (
                  <React.Fragment key={page}>
                    {showEllipsisBefore && (
                      <span className="btn btn-secondary p-2 cursor-default">...</span>
                    )}
                    
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`btn ${
                        currentPage === page ? 'btn-primary' : 'btn-secondary'
                      } p-2 w-8`}
                    >
                      {page}
                    </button>
                    
                    {showEllipsisAfter && (
                      <span className="btn btn-secondary p-2 cursor-default">...</span>
                    )}
                  </React.Fragment>
                );
              })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`btn btn-secondary p-2 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentList; 