import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css'; // Import the CSS file
import { AuthContext } from '../contexts/AuthProvider';
import { assets } from '../assets/assets.js';


const Navbar = ({ toggleSidebar, isVisible }) => {
    // const {logout} = useContext(AuthContext);
    const {auth, logout} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        document.getElementById('logout-form').submit();
    };

    const navigateToPage = (url) => {
        window.location.href = url; // Redirect to the specified URL
    };

    return (
        <div className='d-flex flex-column'>
            <nav className={`main-header navbar navbar-expand-lg navbar-light`}>
                <div className="container-fluid d-flex justify-content-between">
                    {/* Left navbar links */}
                    <div className="navbar-left d-flex align-items-center">
                        <button className="nav-link sidebar-toggle me-3" onClick={toggleSidebar}>
                            <i className="fas fa-bars"></i>
                        </button>
                        <p className="nav-link welcome-text mb-0" onClick={() => navigateToPage('#')}>
                            Welcome Ngoma College
                        </p>
                    </div>

                    {/* Right navbar links */}
                    <div className="navbar-right d-flex align-items-center">
                        <p className="nav-link mb-0 year-text" onClick={() => navigateToPage('#')}>
                            2023 - 2024
                        </p>
                        <p className="nav-link mb-0 logout-text" onClick={logout}>
                            Logout <i className="fas fa-sign-out-alt"></i>
                        </p>
                        
                    </div>
                </div>

            </nav>
            {/* <div className='ml-5 opacity-25 mt-3'>
                <div className='d-flex'>
                    <p onClick={navigate(-1)}><img onClick={navigate(-1)} src={assets.arrow_left} className='bg-dark p-1' style={{ width: '30px', height: '20px' }} /></p>&nbsp;
                    <p onClick={navigate(1)}><img onClick={navigate(1)} src={assets.arrow_right} className='bg-dark p-1' style={{ width: '30px', height: '20px' }} /></p>
                </div>
            </div> */}
        </div>
    );
};

export default Navbar;
