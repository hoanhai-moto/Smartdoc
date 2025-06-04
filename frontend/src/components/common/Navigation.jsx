import React, { useState, useEffect } from 'react';
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

const Navigation = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  
  // State for dropdown menus
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // Toggle dropdown
  const toggleDropdown = (section) => {
    setActiveDropdown(activeDropdown === section ? null : section);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  
  // Check if a route is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  // Navigation item with dropdown
  const NavItem = ({ title, icon: Icon, path, children, sectionKey, isLastChild }) => {
    const hasChildren = Boolean(children);
    const isOpen = activeDropdown === sectionKey;
    
    const handleClick = (e) => {
      if (hasChildren) {
        e.stopPropagation();
        toggleDropdown(sectionKey);
      }
    };
    
    return (
      <div className="relative inline-block" onClick={handleClick}>
        {hasChildren ? (
          <button
            className={`flex items-center px-4 py-2 hover:text-primary-500 ${
              isActive(path) ? 'text-primary-500' : 'text-secondary-700'
            }`}
          >
            <Icon size={18} className="mr-2" />
            <span>{title}</span>
            <ChevronDown size={16} className="ml-1" />
          </button>
        ) : (
          <NavLink
            to={path}
            className={({ isActive }) => 
              `flex items-center px-4 py-2 hover:text-primary-500 ${
                isActive ? 'text-primary-500' : 'text-secondary-700'
              }`
            }
          >
            <Icon size={18} className="mr-2" />
            <span>{title}</span>
          </NavLink>
        )}
        
        {hasChildren && isOpen && (
          <div className={`absolute z-50 mt-1 w-56 bg-white rounded-md shadow-lg py-1 ${isLastChild ? 'right-0' : 'left-0'}`}>
            {children}
          </div>
        )}
      </div>
    );
  };
  
  // Dropdown menu item
  const DropdownItem = ({ title, icon: Icon, path, badge }) => {
    return (
      <NavLink
        to={path}
        className={({ isActive }) => 
          `flex items-center px-4 py-2 hover:bg-gray-100 ${
            isActive ? 'text-primary-500 bg-gray-50' : 'text-secondary-700'
          }`
        }
      >
        {Icon && <Icon size={16} className="mr-1" />}
        <span>{title}</span>
        {badge && (
          <span className="ml-auto bg-primary-500 text-white !text-[14px] rounded-full w-5 h-5 flex items-center justify-center">
            {badge}
          </span>
        )}
      </NavLink>
    );
  };
  
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-4">
          
          <div className="flex items-center space-x-2">
            <NavItem title="Trang chủ" icon={Home} path="/" />
            
            <NavItem title="Hồ sơ cá nhân" icon={User} sectionKey="personal">
              <DropdownItem title="Upload file" icon={FilePlus} path="/personal/upload" />
              <DropdownItem title="Quản lý file cá nhân" icon={File} path="/personal/files" />
              <DropdownItem title="Quản lý file chia sẻ" icon={Share2} path="/personal/shared" />
              <DropdownItem title="Mượn/trả hồ sơ" icon={RefreshCw} path="/personal/borrow" />
            </NavItem>
            
            <NavItem title="Hồ sơ văn phòng" icon={Briefcase} sectionKey="office">
              <DropdownItem title="Upload file" icon={FilePlus} path="/office/upload" />
              <DropdownItem title="Quản lý file" icon={Folder} path="/office/files" />
              <DropdownItem title="Quản lý kho lưu trữ" icon={Archive} path="/office/archive" />
            </NavItem>

            <NavItem title="Kho lưu trữ" icon={Archive} sectionKey="archive">
              <DropdownItem title="Quản lý kho lưu trữ" icon={FilePlus} path="/archive/management" />
              <DropdownItem title="Mượn/trả hồ sơ" icon={Folder} path="/archive/borrow" />
              <DropdownItem title="Phê duyệt mượn hồ sơ" icon={Archive} path="/archive/approve" />
            </NavItem>

            <NavItem title="Loại hồ sơ" icon={Shield} sectionKey="records">
              <DropdownItem title="Hồ sơ công chứng" icon={FileText} path="/records/notarized" />
              <DropdownItem title="Hồ sơ sao y" icon={FileText} path="/records/certified" />
              <DropdownItem title="Hồ sơ chứng thực" icon={FileText} path="/records/authenticated" />
              <DropdownItem title="Hồ sơ dịch thuật" icon={Globe} path="/records/translated" />
            </NavItem>

            <NavItem title="Loại công văn" icon={FileText} sectionKey="documents">
              <DropdownItem title="Công văn đi" icon={ExternalLink} path="/documents/outgoing" />
              <DropdownItem title="Công văn đến" icon={ExternalLink} path="/documents/incoming" />
              <DropdownItem title="Công văn ngăn chặn" icon={File} path="/documents/blocking" />
              <DropdownItem title="Công văn nội bộ" icon={File} path="/documents/internal" />
              <DropdownItem title="Mẫu dấu - Mẫu chữ ký" icon={FileText} path="/documents/templates" />
            </NavItem>

            <NavItem title="Thống kê" icon={BarChart2} sectionKey="statistics">
              <DropdownItem title="Loại hồ sơ" icon={BarChart2} path="/statistics/records" />
              <DropdownItem title="Loại công văn" icon={BarChart2} path="/statistics/documents" />
              <DropdownItem title="Loại khách hàng" icon={BarChart2} path="/statistics/customers" />
              <DropdownItem title="Đối chiếu PM MISA" icon={BarChart2} path="/statistics/misa" />
            </NavItem>

            <NavItem title="Báo cáo" icon={PieChart} sectionKey="reports">
              <DropdownItem title="Xuất BC hồ sơ" icon={PieChart} path="/reports/records" />
              <DropdownItem title="Xuất BC công văn" icon={PieChart} path="/reports/documents" />
              <DropdownItem title="Xuất BC khách hàng" icon={PieChart} path="/reports/customers" />
            </NavItem>
            
            <NavItem title="Cấu hình" icon={Settings} sectionKey="settings" isLastChild={true}>
              <DropdownItem title="Tài khoản cá nhân" icon={User} path="/settings/account" />
              <DropdownItem title="Danh sách nhân viên" icon={Users} path="/settings/employees" />
              <DropdownItem title="Danh sách phòng ban" icon={Briefcase} path="/settings/departments" />
              <DropdownItem title="Chức danh" icon={Briefcase} path="/settings/job-titles" />
              <DropdownItem title="Loại hồ sơ" icon={FileText} path="/settings/record-types" />
              <DropdownItem title="Loại công văn" icon={FileText} path="/settings/document-types" />
              <DropdownItem title="Lưu trữ hồ sơ" icon={Archive} path="/settings/archive" />
            </NavItem>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 