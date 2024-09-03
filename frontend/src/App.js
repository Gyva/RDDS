import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
<<<<<<< HEAD
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import StudentRegistrationForm from './components/StudentRegistrationForm';
import Login from './components/Login';
import GetPasswordForm from './components/GetPasswordForm';
=======
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import StudentRegistrationForm from './components/Student/StudentRegistrationForm';
import Login from './components/Login/Login';
import GetPasswordForm from './components/Password/GetPasswordForm'
import SetPassword from './components/Password/SetPassword';
>>>>>>> 62251460a8224d0411685f26cb957057fc84d302
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
<<<<<<< HEAD
        // <Router>
        //     <Routes>
        //         <Route path="/login" element={<Login onLogin={handleLogin} />} />
        //         <Route path="/claim_password" element={<GetPasswordForm />} />
        //         <Route
        //             path="*"
        //             element={
        //                 isAuthenticated ? (
        //                     <div className={`app-container ${isSidebarVisible ? 'sidebar-visible' : 'sidebar-hidden'}`}>
        //                         <Sidebar isVisible={isSidebarVisible} />
        //                         <div className="content-wrapper">
        //                             <Navbar toggleSidebar={toggleSidebar} isVisible={isSidebarVisible} />
        //                             <div className="main-content">
        //                                 <Routes>
        //                                     <Route path="/register" element={<StudentRegistrationForm />} />
        //                                     <Route path="*" element={<Navigate to="/register" />} />
        //                                 </Routes>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 ) : (
        //                     <Navigate to="/login" />
        //                 )
        //             }
        //         />
        //     </Routes>
        // </Router>

        <div className={`app-container ${isSidebarVisible ? 'sidebar-visible' : 'sidebar-hidden'}`}>
            <Sidebar isVisible={isSidebarVisible} />
            <div className="content-wrapper">
                <Navbar toggleSidebar={toggleSidebar} isVisible={isSidebarVisible} />
                <div className="main-content">
                    <GetPasswordForm />
                </div>
            </div>
        </div>
=======
        <Router>
            <Routes>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/claim_password" element={<GetPasswordForm/>} />
                <Route 
                    path="*" 
                    element={
                        isAuthenticated ? (
                            <div className={`app-container ${isSidebarVisible ? 'sidebar-visible' : 'sidebar-hidden'}`}>
                                {isAuthenticated && <Sidebar isVisible={isSidebarVisible} />}
                                <div className="content-wrapper">
                                    {isAuthenticated && <Navbar toggleSidebar={toggleSidebar} isVisible={isSidebarVisible} />}
                                    <div className="main-content">
                                        <Routes>
                                            <Route path="/register" element={<StudentRegistrationForm />} />
                                            <Route path="*" element={<Navigate to="/register" />} />
                                        </Routes>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
            </Routes>
        </Router>
        //////////-------------------------------------------------------------
        // <div className={`app-container ${isSidebarVisible ? 'sidebar-visible' : 'sidebar-hidden'}`}>
        //     <Sidebar isVisible={isSidebarVisible} />
        //     <div className="content-wrapper">
        //         <Navbar toggleSidebar={toggleSidebar} isVisible={isSidebarVisible} />
        //         <div className="main-content">
        //             <StudentRegistrationForm />
        //         </div>
        //     </div>
        // </div>

>>>>>>> 62251460a8224d0411685f26cb957057fc84d302
    );
};

export default App;

