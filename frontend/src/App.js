import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/public/Login/Login'
import GetPasswordForm from './components/public/Password/GetPasswordForm'
import SetPassword from './components/public/Password/SetPassword'

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
        // <div className={`app-container`}>
        //     <div className="content-wrapper">
        //         <div className="main-content">
        //             <Login />
        //         </div>
        //     </div>
        // </div>
        <Router>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/claim_password' element={<GetPasswordForm />} />
                <Route path="/set-password" element={<SetPassword />} />

            </Routes>
        </Router>

    );
};

export default App;

