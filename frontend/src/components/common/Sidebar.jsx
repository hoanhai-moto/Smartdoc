import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  File,
  Folder,
  Archive,
  FileText,
  ExternalLink,
  BarChart2,
  FilePlus,
  Share2,
  RefreshCw,
  PieChart,
  Settings,
  ChevronDown,
  ChevronUp,
  Users,
  Briefcase,
  Shield,
  Clock,
  Globe,
  User
} from 'react-feather';

const Sidebar = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  
  // State for collapsible sections
  const [openSections, setOpenSections] = useState({
    personal: true,
    office: false,
    archive: false,
    records: false,
    documents: false,
    statistics: false,
    reports: false,
    settings: false
  });
  
  // Toggle a section's open/closed state
  const toggleSection = (section) => {
    setOpenSections({
      ...openSections,
      [section]: !openSections[section]
    });
  };
  
  // Check if a route is active (either exact match or starts with the path)
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  // Sidebar section component
  const SidebarSection = ({ title, icon: Icon, path, children, sectionKey }) => {
    const hasChildren = Boolean(children);
    const isOpen = openSections[sectionKey];
    
    // If this section or any of its children is active, highlight the section
    const isActiveSection = hasChildren
      ? React.Children.toArray(children).some(child => isActive(child.props.path))
      : isActive(path);
    
    return (
      <div className="mb-1">
        {hasChildren ? (
          <button
            className={`sidebar-link w-full flex justify-between ${isActiveSection ? 'text-primary-500 font-medium' : 'text-secondary-700'}`}
            onClick={() => toggleSection(sectionKey)}
          >
            <div className="flex items-center">
              <Icon size={18} className="mr-2" />
              <span>{title}</span>
            </div>
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        ) : (
          <NavLink
            to={path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={18} />
            <span>{title}</span>
          </NavLink>
        )}
        
        {hasChildren && isOpen && (
          <div className="ml-8 mt-1 space-y-1">
            {children}
          </div>
        )}
      </div>
    );
  };
  
  // Sidebar link component
  const SidebarLink = ({ title, icon: Icon, path, badge }) => {
    return (
      <NavLink
        to={path}
        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
      >
        {Icon && <Icon size={16} className="mr-2" />}
        <span>{title}</span>
        {badge && (
          <span className="ml-auto bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {badge}
          </span>
        )}
      </NavLink>
    );
  };
  
  return (
    <aside className="w-64 bg-white shadow-sidebar h-screen overflow-y-auto">
      <div className="py-6 px-4">
        <div className="flex items-center mb-8">
          <img 
            src="/logo.png" 
            alt="SmartDoc Logo" 
            className="h-8 w-8 mr-2"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/32';
            }}
          />
          <span className="text-xl font-bold text-primary-800">SmartDoc</span>
        </div>
        
        <nav className="space-y-1">
          <SidebarLink title="Trang chủ" icon={Home} path="/" />
          
          <SidebarSection 
            title="Cá nhân" 
            icon={User} 
            sectionKey="personal"
          >
            <SidebarLink title="Upload file" icon={FilePlus} path="/personal/upload" />
            <SidebarLink title="Quản lý file cá nhân" icon={File} path="/personal/files" />
            <SidebarLink title="Quản lý file chia sẻ" icon={Share2} path="/personal/shared" />
            <SidebarLink title="Mượn/trả hồ sơ" icon={RefreshCw} path="/personal/borrow" />
          </SidebarSection>
          
          <SidebarSection 
            title="Quản lý hồ sơ Văn Phòng" 
            icon={Briefcase} 
            sectionKey="office"
          >
            <SidebarLink title="Upload file" icon={FilePlus} path="/office/upload" />
            <SidebarLink title="Quản lý file" icon={Folder} path="/office/files" />
            <SidebarLink title="Quản lý kho lưu trữ" icon={Archive} path="/office/archive" />
          </SidebarSection>
          
          <SidebarSection 
            title="Kho Lưu Trữ" 
            icon={Archive} 
            sectionKey="archive"
          >
            <SidebarLink title="Quản lý kho lưu trữ" icon={Folder} path="/archive/management" />
            <SidebarLink title="Mượn/trả hồ sơ" icon={RefreshCw} path="/archive/borrow" />
            <SidebarLink title="Phê duyệt mượn hồ sơ" icon={Clock} path="/archive/approve" badge="5" />
          </SidebarSection>
          
          <SidebarSection 
            title="Loại Hồ Sơ" 
            icon={Shield} 
            sectionKey="records"
          >
            <SidebarLink title="Hồ sơ công chứng" icon={FileText} path="/records/notarized" />
            <SidebarLink title="Hồ sơ Sao Y" icon={FileText} path="/records/certified" />
            <SidebarLink title="Hồ sơ chứng thực" icon={FileText} path="/records/authenticated" />
            <SidebarLink title="Hồ sơ dịch thuật" icon={Globe} path="/records/translated" />
          </SidebarSection>
          
          <SidebarSection 
            title="Loại Công văn" 
            icon={FileText} 
            sectionKey="documents"
          >
            <SidebarLink title="Công văn đi" icon={ExternalLink} path="/documents/outgoing" />
            <SidebarLink title="Công văn đến" icon={ExternalLink} path="/documents/incoming" />
            <SidebarLink title="Công văn ngăn chặn" icon={File} path="/documents/blocking" />
            <SidebarLink title="Công văn nội bộ" icon={File} path="/documents/internal" />
            <SidebarLink title="Mẫu dấu - Mẫu chữ ký" icon={FileText} path="/documents/templates" />
          </SidebarSection>
          
          <SidebarSection 
            title="Thống kê" 
            icon={BarChart2} 
            sectionKey="statistics"
          >
            <SidebarLink title="Loại hồ sơ" icon={BarChart2} path="/statistics/records" />
            <SidebarLink title="Loại công văn" icon={BarChart2} path="/statistics/documents" />
            <SidebarLink title="Loại Khách hàng" icon={BarChart2} path="/statistics/customers" />
            <SidebarLink title="Đối chiếu PM MISA" icon={BarChart2} path="/statistics/misa" />
          </SidebarSection>
          
          <SidebarSection 
            title="Báo cáo" 
            icon={PieChart} 
            sectionKey="reports"
          >
            <SidebarLink title="Xuất BC hồ sơ" icon={PieChart} path="/reports/records" />
            <SidebarLink title="Xuất BC công văn" icon={PieChart} path="/reports/documents" />
            <SidebarLink title="Xuất BC khách hàng" icon={PieChart} path="/reports/customers" />
          </SidebarSection>
          
          <SidebarSection 
            title="Cấu hình" 
            icon={Settings} 
            sectionKey="settings"
          >
            <SidebarLink title="Tài khoản cá nhân" icon={User} path="/settings/account" />
            <SidebarLink title="Danh sách nhân viên" icon={Users} path="/settings/employees" />
            <SidebarLink title="Danh sách phòng ban" icon={Briefcase} path="/settings/departments" />
            <SidebarLink title="Chức danh" icon={Briefcase} path="/settings/job-titles" />
            <SidebarLink title="Loại hồ sơ" icon={FileText} path="/settings/record-types" />
            <SidebarLink title="Loại công văn" icon={FileText} path="/settings/document-types" />
            <SidebarLink title="Lưu trữ hồ sơ" icon={Archive} path="/settings/archive" />
          </SidebarSection>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar; 