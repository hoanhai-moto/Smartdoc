import React, { useState, useEffect } from 'react';
import { File, Archive, RefreshCw, Users, ArrowUp, ArrowDown } from 'react-feather';
import { Link } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  // Sample data - In a real application, this would come from an API
  const [stats, setStats] = useState({
    personalFiles: 78,
    officeFiles: 145,
    archivedFiles: 512,
    borrowRequests: 12,
    pendingApprovals: 5,
    recentActivity: [
      { id: 1, user: 'Hiếu Nguyên', action: 'uploaded', document: 'Financial Report Q2.pdf', time: '2 hours ago' },
      { id: 2, user: 'Thành Đạt', action: 'shared', document: 'Project Proposal.docx', time: '3 hours ago' },
      { id: 3, user: 'Minh Tuấn', action: 'requested', document: 'Legal Contract #1234', time: '5 hours ago' },
      { id: 4, user: 'Thị Hương', action: 'approved', document: 'Meeting Minutes.pdf', time: '1 day ago' },
      { id: 5, user: 'Văn Nam', action: 'archived', document: 'Tax Report 2023.xlsx', time: '2 days ago' },
    ]
  });
  
  // Bar chart data
  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Personal Files',
        data: [12, 19, 25, 16, 28, 31],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'Office Files',
        data: [24, 31, 38, 29, 43, 49],
        backgroundColor: 'rgba(14, 159, 110, 0.5)',
      },
    ],
  };
  
  // Pie chart data for document types
  const pieChartData = {
    labels: ['Notarized', 'Certified', 'Authenticated', 'Translated'],
    datasets: [
      {
        data: [35, 25, 22, 18],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(239, 68, 68, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-secondary-900">Dashboard</h1>
        <div>
          <span className="text-sm text-secondary-500">Last updated: {new Date().toLocaleString()}</span>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card flex items-center justify-between">
          <div>
            <p className="text-sm text-secondary-500 mb-1">Personal Files</p>
            <p className="text-2xl font-bold">{stats.personalFiles}</p>
            <div className="flex items-center text-success-500 text-sm mt-1">
              <ArrowUp size={14} className="mr-1" />
              <span>12% from last month</span>
            </div>
          </div>
          <div className="bg-primary-100 p-3 rounded-full">
            <File size={24} className="text-primary-500" />
          </div>
        </div>
        
        <div className="card flex items-center justify-between">
          <div>
            <p className="text-sm text-secondary-500 mb-1">Office Files</p>
            <p className="text-2xl font-bold">{stats.officeFiles}</p>
            <div className="flex items-center text-success-500 text-sm mt-1">
              <ArrowUp size={14} className="mr-1" />
              <span>8% from last month</span>
            </div>
          </div>
          <div className="bg-success-100 p-3 rounded-full">
            <File size={24} className="text-success-500" />
          </div>
        </div>
        
        <div className="card flex items-center justify-between">
          <div>
            <p className="text-sm text-secondary-500 mb-1">Archived Files</p>
            <p className="text-2xl font-bold">{stats.archivedFiles}</p>
            <div className="flex items-center text-secondary-500 text-sm mt-1">
              <span>Total in archives</span>
            </div>
          </div>
          <div className="bg-secondary-100 p-3 rounded-full">
            <Archive size={24} className="text-secondary-500" />
          </div>
        </div>
        
        <div className="card flex items-center justify-between">
          <div>
            <p className="text-sm text-secondary-500 mb-1">Borrow Requests</p>
            <p className="text-2xl font-bold">{stats.borrowRequests}</p>
            <div className="flex items-center text-danger-500 text-sm mt-1">
              <ArrowDown size={14} className="mr-1" />
              <span>3% from last month</span>
            </div>
          </div>
          <div className="bg-warning-100 p-3 rounded-full">
            <RefreshCw size={24} className="text-warning-500" />
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Document Upload Trends</h2>
          <div className="h-64">
            <Bar data={barChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Document Types Distribution</h2>
          <div className="h-64 flex items-center justify-center">
            <div className="w-3/4">
              <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <Link to="/reports" className="text-primary-500 text-sm hover:underline">
            View All
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">User</th>
                <th className="table-header-cell">Action</th>
                <th className="table-header-cell">Document</th>
                <th className="table-header-cell">Time</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {stats.recentActivity.map((activity) => (
                <tr key={activity.id} className="table-row">
                  <td className="table-cell">{activity.user}</td>
                  <td className="table-cell">
                    <span className={`badge ${
                      activity.action === 'uploaded' ? 'badge-info' :
                      activity.action === 'shared' ? 'badge-success' :
                      activity.action === 'requested' ? 'badge-warning' :
                      activity.action === 'approved' ? 'badge-success' :
                      'badge-info'
                    }`}>
                      {activity.action}
                    </span>
                  </td>
                  <td className="table-cell">{activity.document}</td>
                  <td className="table-cell">{activity.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pending Approvals */}
      {stats.pendingApprovals > 0 && (
        <div className="card bg-warning-50 border border-warning-200">
          <div className="flex items-start space-x-4">
            <div className="bg-warning-100 p-2 rounded-full">
              <RefreshCw size={20} className="text-warning-500" />
            </div>
            <div>
              <h3 className="font-medium">Pending Approvals</h3>
              <p className="text-sm text-secondary-600 mt-1">
                You have {stats.pendingApprovals} borrow requests waiting for approval.
              </p>
              <Link 
                to="/archive/approve" 
                className="inline-block mt-2 text-sm text-warning-600 hover:text-warning-700 font-medium"
              >
                Review Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 