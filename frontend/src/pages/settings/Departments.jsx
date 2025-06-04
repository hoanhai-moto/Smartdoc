import React, { useState, useEffect } from 'react';
import { RefreshCw, Plus, Edit, Trash2 } from 'react-feather';
import axios from 'axios';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [editId, setEditId] = useState(null);
  
  useEffect(() => {
    fetchDepartments();
  }, []);
  
  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/api/departments/');
      setDepartments(response.data);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError('Failed to load departments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      description: ''
    });
    setEditId(null);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleAddOpen = () => {
    resetForm();
    setShowAddModal(true);
  };
  
  const handleEditOpen = (department) => {
    setFormData({
      name: department.name,
      description: department.description || ''
    });
    setEditId(department.id);
    setShowEditModal(true);
  };
  
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('/api/departments/', formData);
      setDepartments([...departments, response.data]);
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error('Error adding department:', err);
      alert('Failed to add department. Please try again later.');
    }
  };
  
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.put(`/api/departments/${editId}/`, formData);
      setDepartments(departments.map(dept => 
        dept.id === editId ? response.data : dept
      ));
      setShowEditModal(false);
      resetForm();
    } catch (err) {
      console.error('Error updating department:', err);
      alert('Failed to update department. Please try again later.');
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) {
      return;
    }
    
    try {
      await axios.delete(`/api/departments/${id}/`);
      setDepartments(departments.filter(dept => dept.id !== id));
    } catch (err) {
      console.error('Error deleting department:', err);
      alert('Failed to delete department. Please try again later.');
    }
  };
  
  // Add Department Modal
  const AddDepartmentModal = () => {
    return (
      <div className="fixed inset-0 bg-secondary-900 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="p-4 border-b border-secondary-200 flex justify-between items-center">
            <h2 className="text-lg font-medium">Add Department</h2>
            <button 
              onClick={() => setShowAddModal(false)}
              className="text-secondary-500 hover:text-secondary-700"
            >
              &times;
            </button>
          </div>
          
          <form onSubmit={handleAddSubmit}>
            <div className="p-4">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-1">
                  Department Name*
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter department name"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-secondary-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter department description"
                ></textarea>
              </div>
            </div>
            
            <div className="p-4 border-t border-secondary-200 flex justify-end">
              <button
                type="button"
                className="btn btn-secondary mr-2"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Add Department
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  // Edit Department Modal
  const EditDepartmentModal = () => {
    return (
      <div className="fixed inset-0 bg-secondary-900 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="p-4 border-b border-secondary-200 flex justify-between items-center">
            <h2 className="text-lg font-medium">Edit Department</h2>
            <button 
              onClick={() => setShowEditModal(false)}
              className="text-secondary-500 hover:text-secondary-700"
            >
              &times;
            </button>
          </div>
          
          <form onSubmit={handleEditSubmit}>
            <div className="p-4">
              <div className="mb-4">
                <label htmlFor="edit-name" className="block text-sm font-medium text-secondary-700 mb-1">
                  Department Name*
                </label>
                <input
                  id="edit-name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter department name"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="edit-description" className="block text-sm font-medium text-secondary-700 mb-1">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter department description"
                ></textarea>
              </div>
            </div>
            
            <div className="p-4 border-t border-secondary-200 flex justify-end">
              <button
                type="button"
                className="btn btn-secondary mr-2"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Update Department
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-secondary-900">Departments</h1>
        <div className="flex space-x-2">
          <button
            className="btn btn-secondary flex items-center"
            onClick={fetchDepartments}
          >
            <RefreshCw size={16} className="mr-1" />
            <span>Refresh</span>
          </button>
          
          <button
            className="btn btn-primary flex items-center"
            onClick={handleAddOpen}
          >
            <Plus size={16} className="mr-1" />
            <span>Add Department</span>
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-danger-50 border-l-4 border-danger-500 p-4">
          <p className="text-sm text-danger-700">{error}</p>
        </div>
      )}
      
      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Name</th>
              <th className="table-header-cell">Description</th>
              <th className="table-header-cell w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {loading ? (
              <tr>
                <td colSpan="3" className="table-cell text-center py-8">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                  </div>
                </td>
              </tr>
            ) : departments.length === 0 ? (
              <tr>
                <td colSpan="3" className="table-cell text-center py-8">
                  <p className="text-secondary-500">No departments found</p>
                </td>
              </tr>
            ) : (
              departments.map(department => (
                <tr key={department.id} className="table-row">
                  <td className="table-cell font-medium">{department.name}</td>
                  <td className="table-cell">{department.description || '-'}</td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditOpen(department)}
                        className="text-secondary-500 hover:text-primary-500"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(department.id)}
                        className="text-secondary-500 hover:text-danger-500"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {showAddModal && <AddDepartmentModal />}
      {showEditModal && <EditDepartmentModal />}
    </div>
  );
};

export default Departments; 