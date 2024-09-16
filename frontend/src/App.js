import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/public/Login/Login';
import GetPasswordForm from './components/public/Password/GetPasswordForm';
import SetPassword from './components/public/Password/SetPassword';
import Navbar from './components/users/Navbar';
import Sidebar from './components/users/Sidebar';
import './App.css'; // Import the CSS styles here
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/users/Dashboard';

function App() {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    // Toggle Sidebar visibility
    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path='/' element={<Login />} />
                    
                </Routes>
                {/* Protected routes */}
                <ProtectedRoute>
                   
                        <div className="app-container">
                            {/* Sidebar component */}
                            <Sidebar isVisible={isSidebarVisible} role={'hod'} />

                            {/* Main content wrapper */}
                            <div className={`content-wrapper ${isSidebarVisible ? 'sidebar-visible' : 'sidebar-hidden'}`}>
                                <Navbar toggleSidebar={toggleSidebar} isVisible={isSidebarVisible} />
                                <div className="main-content">
                                <Routes>
                                    <Route path='/dashboard' element={<Dashboard/>} />
                                </Routes>
                                </div>
                            </div>
                        </div>

                    
                </ProtectedRoute>
            </AuthProvider>
        </Router>
    );
}

export default App;
