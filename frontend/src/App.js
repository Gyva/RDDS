import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/public/Login/Login';
import GetPasswordForm from './components/public/Password/GetPasswordForm';
import SetPassword from './components/public/Password/SetPassword';
import Navbar from './components/users/Navbar';
import Sidebar from './components/users/Sidebar';
import './App.css'; // Import the CSS styles here
// import { AuthProvider } from './contexts/AuthContext'; // Correct import
// import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/users/Dashboard';
import DepartmentsDisplay from './components/users/Hod/Departments/DepartmentsDisplay';
import FacultiesDisplay from './components/users/Hod/Faculties/FacultiesDisplay';
import LevelsDisplay from './components/users/Hod/Levels/LevelsDisplay';
import StudentsDisplay from './components/users/registerer/Student/StudentsDisplay';
import PasswordResetForm from './components/public/Password/PasswordResetForm';
import GrabResetLink from './components/public/Password/GrabResetLink';

function App() {
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
        <>
        {/* Use the correct AuthProvider here */}
             {/* <AuthProvider> */}
                <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Login /> } />
                </Routes>
            {/* Protected routes */}
            {/* <ProtectedRoute> */}
                <div className="app-container">
                    {/* Sidebar component */}
                    <Sidebar isVisible={isSidebarVisible} role={'hod'} />

                    {/* Main content wrapper */}
                    <div className={`content-wrapper ${isSidebarVisible ? 'sidebar-visible' : 'sidebar-hidden'}`}>
                        <Navbar toggleSidebar={toggleSidebar} isVisible={isSidebarVisible} />
                        <div className="main-content">
                            <Routes>
                                <Route path='/dashboard' element={<StudentsDisplay />} />
                                <Route path='/departments' element={<DepartmentsDisplay />} />
                                <Route path='/levels' element={<LevelsDisplay />} />
                                <Route path='/faculties' element={<FacultiesDisplay />} /> 
                                <Route path='/reset-password/:uid/:token' element={<PasswordResetForm/>}/>
                                <Route path='/grab-reset-link' element={<GrabResetLink/>} /> 
                            </Routes>
                        </div>
                    </div>
                </div>
            {/* </ProtectedRoute> */}
        {/* </AuthProvider> */}
        </>
    );
}

export default App;
