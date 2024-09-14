import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/public/Login/Login';
import GetPasswordForm from './components/public/Password/GetPasswordForm';
import SetPassword from './components/public/Password/SetPassword';
import Navbar from './components/users/Navbar';
import Sidebar from './components/users/Sidebar';
import './App.css'; // Import the CSS styles here

const App = () => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    // Toggle Sidebar visibility
    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    return (
        <Router>
            <Routes>
                            <Route path='/' element={<Login />} />
                            <Route path='/claim_password' element={<GetPasswordForm />} />
                            <Route path='/set-password' element={<SetPassword />} />
                        </Routes>
            {/* <div className="app-container"> */}
                {/* Sidebar component */}
                {/* <Sidebar isVisible={isSidebarVisible} role={'student'} /> */}
                
                {/* Main content wrapper */}
                {/* <div className={`content-wrapper ${isSidebarVisible ? 'sidebar-visible' : 'sidebar-hidden'}`}> */}
                    {/* <Navbar toggleSidebar={toggleSidebar} isVisible={isSidebarVisible} /> */}
                    {/* <div className="main-content"> */}
                        
                    {/* </div> */}
                {/* </div> */}
            {/* </div> */}
        </Router>
    );
};

export default App;
