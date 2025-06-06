import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, Bell, Settings, ChevronDown, AlertTriangle, Globe } from 'react-feather';
import userAvatar from '../../assets/images/avatar.png';
import logo from '../../assets/images/logo.png';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState(3); // Mock notifications count
  
  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatDatetime = (date) => {
    // Format: "Th 2, ngày 29/05/2025 - 19:58"
    const days = ['Chủ nhật', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'];
    const dayOfWeek = days[date.getDay()];
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${dayOfWeek}, ngày ${day}/${month}/${year} - ${hours}:${minutes}`;
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* put logo next to title Smart Doc */}
          <div className="flex items-center">
            <img src={logo} alt="logo" className="h-10 w-10 mr-2" />
            <h1 className="text-xl font-bold text-primary-500">Smart Doc</h1>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center text-warning-500 mr-4">
              <AlertTriangle size={18} className="mr-2" />
              <span className="text-sm">{formatDatetime(currentTime)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="bg-secondary-100 rounded-full py-1 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
              <Search size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-500" />
            </div>
            
            <div className="relative">
              <button className="text-secondary-500 hover:text-primary-500">
                <Bell size={24} />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-danger-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
            </div>
            
            <button className="text-secondary-500 hover:text-primary-500">
              <Settings size={24} />
            </button>
            
            <div className="relative ml-2">
              <div className="flex items-center space-x-1">
                <Globe size={18} className="text-secondary-500" />
                <span className="text-sm">Tiếng Việt</span>
              </div>
            </div>
            
            <div className="relative">
              <button
                className="flex items-center space-x-2"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span className="text-sm font-medium">
                  {currentUser?.first_name} {currentUser?.last_name || 'Hiếu Nguyễn'}
                </span>
                <img
                  src={userAvatar}
                  alt="Ảnh đại diện"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <ChevronDown size={16} className="text-secondary-500" />
              </button>
              
              {showDropdown && (
                <div className="dropdown-menu">
                  <a href="/settings/account" className="dropdown-item">Hồ sơ</a>
                  <a href="/settings" className="dropdown-item">Cài đặt</a>
                  <button onClick={handleLogout} className="dropdown-item text-danger-500">
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 