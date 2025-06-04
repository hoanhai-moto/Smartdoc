import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Navigation from './components/common/Navigation';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard
import Dashboard from './pages/Dashboard';

// Personal profile pages
import PersonalUpload from './pages/personal/Upload';
import PersonalFiles from './pages/personal/Files';
import SharedFiles from './pages/personal/SharedFiles';
// import BorrowRequests from './pages/personal/BorrowRequests';

// Office management pages
// import OfficeUpload from './pages/office/Upload';
// import OfficeFiles from './pages/office/Files';
// import OfficeArchive from './pages/office/Archive';

// Archive pages
// import ArchiveManagement from './pages/archive/Management';
// import ArchiveBorrowRequests from './pages/archive/BorrowRequests';
// import ApproveRequests from './pages/archive/ApproveRequests';

// Record types pages
import NotarizedRecords from './pages/records/Notarized';
// import CertifiedRecords from './pages/records/Certified';
// import AuthenticatedRecords from './pages/records/Authenticated';
// import TranslatedRecords from './pages/records/Translated';

// Document types pages
// import OutgoingDocuments from './pages/documents/Outgoing';
// import IncomingDocuments from './pages/documents/Incoming';
// import BlockingDocuments from './pages/documents/Blocking';
// import InternalDocuments from './pages/documents/Internal';
// import TemplatesPage from './pages/documents/Templates';

// Statistics pages
// import RecordStats from './pages/statistics/Records';
// import DocumentStats from './pages/statistics/Documents';
// import CustomerStats from './pages/statistics/Customers';
// import MISAReconciliation from './pages/statistics/MISA';

// Reports pages
// import RecordReports from './pages/reports/Records';
// import DocumentReports from './pages/reports/Documents';
// import CustomerReports from './pages/reports/Customers';

// Settings pages
// import PersonalAccount from './pages/settings/PersonalAccount';
// import Employees from './pages/settings/Employees';
import Departments from './pages/settings/Departments';
// import JobTitles from './pages/settings/JobTitles';
// import RecordTypesSettings from './pages/settings/RecordTypes';
// import DocumentTypesSettings from './pages/settings/DocumentTypes';
// import ArchiveSettings from './pages/settings/Archive';

// Placeholder component for not yet implemented pages
const NotImplemented = () => (
  <div className="flex flex-col items-center justify-center h-64">
    <h2 className="text-xl font-semibold text-secondary-700 mb-2">Sắp ra mắt</h2>
    <p className="text-secondary-500">Trang này chưa được triển khai.</p>
  </div>
);

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Đang tải...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const App = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen">
      {currentUser ? (
        <div className="flex flex-col min-h-screen">
          <Header />
          <Navigation />
          <main className="flex-1 p-6 bg-gray-50">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              
              {/* Personal profile routes */}
              <Route path="/personal/upload" element={<PersonalUpload />} />
              <Route path="/personal/files" element={<PersonalFiles />} />
              <Route path="/personal/shared" element={<SharedFiles />} />
              <Route path="/personal/borrow" element={<NotImplemented />} />
              
              {/* Office management routes */}
              <Route path="/office/upload" element={<NotImplemented />} />
              <Route path="/office/files" element={<NotImplemented />} />
              <Route path="/office/archive" element={<NotImplemented />} />
              
              {/* Archive routes */}
              <Route path="/archive/management" element={<NotImplemented />} />
              <Route path="/archive/borrow" element={<NotImplemented />} />
              <Route path="/archive/approve" element={<NotImplemented />} />
              
              {/* Record types routes */}
              <Route path="/records/notarized" element={<NotarizedRecords />} />
              <Route path="/records/certified" element={<NotImplemented />} />
              <Route path="/records/authenticated" element={<NotImplemented />} />
              <Route path="/records/translated" element={<NotImplemented />} />
              
              {/* Document types routes */}
              <Route path="/documents/outgoing" element={<NotImplemented />} />
              <Route path="/documents/incoming" element={<NotImplemented />} />
              <Route path="/documents/blocking" element={<NotImplemented />} />
              <Route path="/documents/internal" element={<NotImplemented />} />
              <Route path="/documents/templates" element={<NotImplemented />} />
              
              {/* Statistics routes */}
              <Route path="/statistics/records" element={<NotImplemented />} />
              <Route path="/statistics/documents" element={<NotImplemented />} />
              <Route path="/statistics/customers" element={<NotImplemented />} />
              <Route path="/statistics/misa" element={<NotImplemented />} />
              
              {/* Reports routes */}
              <Route path="/reports/records" element={<NotImplemented />} />
              <Route path="/reports/documents" element={<NotImplemented />} />
              <Route path="/reports/customers" element={<NotImplemented />} />
              
              {/* Settings routes */}
              <Route path="/settings/account" element={<NotImplemented />} />
              <Route path="/settings/employees" element={<NotImplemented />} />
              <Route path="/settings/departments" element={<Departments />} />
              <Route path="/settings/job-titles" element={<NotImplemented />} />
              <Route path="/settings/record-types" element={<NotImplemented />} />
              <Route path="/settings/document-types" element={<NotImplemented />} />
              <Route path="/settings/archive" element={<NotImplemented />} />
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </div>
  );
};

export default App; 