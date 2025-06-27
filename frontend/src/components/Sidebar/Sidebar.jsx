// src/components/Sidebar/Sidebar.jsx
import React, { useState } from 'react';
import './Sidebar.css';
import { Menu, X } from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuItems = ['ORDERS', 'DELIVERY', 'PRODUCTS', 'HELP'];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className={`mobile-menu-btn ${isOpen ? 'active' : ''}`}
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-title">
            Go<br />SHARE
          </h1>
        </div>
        
        <div className="sidebar-menu">
          {menuItems.map((item) => (
            <button 
              key={item} 
              className="sidebar-button"
              onClick={() => {
                // Add your navigation logic here
                console.log(`Clicked ${item}`);
                // Close sidebar on mobile after clicking
                if (window.innerWidth <= 768) {
                  setIsOpen(false);
                }
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;