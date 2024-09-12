import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/public/Login/Login'
import GetPasswordForm from './components/public/Password/GetPasswordForm'
import SetPassword from './components/public/Password/SetPassword'
import Navbar from './components/users/Navbar'
import Sidebar from './components/users/Sidebar'

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
        // 
        //         
        //             <Login />
        //         </div>
        //     </div>
        // </div>
        <Router>
            <div className={`app-container`}>
                <Sidebar isVisible={true} role={'student'}/>
             <div className="content-wrapper">
                <Navbar/>
             <div className="main-content">
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/claim_password' element={<GetPasswordForm />} />
                <Route path="/set-password" element={<SetPassword />} />
            
            </Routes>
            </div>
            </div></div>
        </Router>

    );
};

export default App;

