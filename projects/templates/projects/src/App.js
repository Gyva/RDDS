import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import StudentRegistrationForm from './components/StudentRegistrationForm';
import Login from './components/Login';
import './App.css'; // Include your global styles here

const App = () => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication status

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <div className={`app-container ${isSidebarVisible ? 'sidebar-visible' : 'sidebar-hidden'}`}>
                {isAuthenticated && <Sidebar isVisible={isSidebarVisible} />}
                <div className="content-wrapper">
                    {isAuthenticated && <Navbar toggleSidebar={toggleSidebar} isVisible={isSidebarVisible} />}
                    <div className="main-content">
                        <Routes>
                            <Route path="/login" element={<Login onLogin={handleLogin} />} />
                            {/* Protect routes by checking isAuthenticated */}
                            {isAuthenticated ? (
                                <>
                                    <Route path="/register" element={<StudentRegistrationForm />} />
                                    <Route path="*" element={<Navigate to="/register" />} />
                                </>
                            ) : (
                                <Route path="*" element={<Navigate to="/login" />} />
                            )}
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    );
};

export default App;
