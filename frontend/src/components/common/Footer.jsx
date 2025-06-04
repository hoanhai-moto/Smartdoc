import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white py-4 border-t border-secondary-200">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="text-sm text-secondary-500">
          © {new Date().getFullYear()} SmartDoc by PixelStrap
        </div>
        <div className="flex space-x-4">
          <select className="text-sm bg-white border border-secondary-300 rounded px-2 py-1">
            <option value="en">English</option>
            <option value="vi">Tiếng Việt</option>
          </select>
          <select className="text-sm bg-white border border-secondary-300 rounded px-2 py-1">
            <option value="asia">Asia</option>
            <option value="europe">Europe</option>
            <option value="america">America</option>
          </select>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 