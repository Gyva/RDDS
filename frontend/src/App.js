import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/public/Login/Login';
import GetPasswordForm from './components/public/Password/GetPasswordForm';
import SetPassword from './components/public/Password/SetPassword';
import Navbar from './components/users/Navbar';
import Sidebar from './components/users/Sidebar';

import './App.css'; // Include your global styles here

const App = () => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);  // Track sidebar visibility

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    return (
        <Router>
            <div className={`app-container ${isSidebarVisible ? 'sidebar-visible' : 'sidebar-hidden'}`}>
                {isSidebarVisible && <Sidebar isVisible={true} role={'student'} />}  {/* Render sidebar conditionally */}
                
                <div className="content-wrapper">
                    <Navbar toggleSidebar={toggleSidebar} /> {/* Pass toggleSidebar to Navbar */}
                    
                    <div className="main-content">
                        <Routes>
                            <Route path="/" element={<Login />} />
                            <Route path="/claim_password" element={<GetPasswordForm />} />
                            <Route path="/set-password" element={<SetPassword />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    );
};

export default App;
