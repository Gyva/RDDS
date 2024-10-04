import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './dash.css';

const Dashboard = ({ children }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(() => {
    const savedSidebarState = localStorage.getItem('isSidebarVisible');
    return savedSidebarState !== null ? JSON.parse(savedSidebarState) : true;
  });

  useEffect(() => {
    localStorage.setItem('isSidebarVisible', JSON.stringify(isSidebarVisible));
  }, [isSidebarVisible]);

  const toggleSidebar = () => {
    setIsSidebarVisible(prevState => !prevState);
  };

  return (
    <div className="app-container">
      {/* Sidebar remains on the side */}
      {/* <Sidebar isVisible={isSidebarVisible} role={'hod'} /> */}

      {/* Main content wrapper, including the navbar */}
      {/* <div className={`content-wrapper ${isSidebarVisible ? 'sidebar-visible' : 'sidebar-hidden'}`}> */}
        {/* Navbar now follows the same layout as the main content */}
        {/* <Navbar toggleSidebar={toggleSidebar} isVisible={isSidebarVisible} /> */}
        
        {/* Main content area */}
        <div className="main-content">
          {children}
        </div>
      {/* </div> */}
    </div>
  );
};

export default Dashboard;
