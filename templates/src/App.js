// src/App.jsx
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import './App.css'; // Include your global styles here
import StudentRegistrationForm from './components/StudentRegistrationForm';

const App = () => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    return (
        <div className={`app-container ${isSidebarVisible ? 'sidebar-visible' : 'sidebar-hidden'}`}>
            <Sidebar isVisible={isSidebarVisible} />
            <div className="content-wrapper">
                <Navbar toggleSidebar={toggleSidebar} isVisible={isSidebarVisible} />
                <div className="main-content">
                    <StudentRegistrationForm />
                </div>
            </div>
        </div>

    );
};

export default App;
