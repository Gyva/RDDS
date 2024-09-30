import React, { useContext } from 'react';
import './Navbar.css'; // Import the CSS file
import { AuthContext } from '../../contexts/AuthProvider';

const Navbar = ({ toggleSidebar, isVisible }) => {
    // const {logout} = useContext(AuthContext);
    
    const handleLogout = (e) => {
        e.preventDefault();
        document.getElementById('logout-form').submit();
    };

    const navigateToPage = (url) => {
        window.location.href = url; // Redirect to the specified URL
    };

    return (
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
                    <p className="nav-link mb-0 logout-text" onClick={handleLogout}>
                        Logout <i className="fas fa-sign-out-alt"></i>
                    </p>
                    <form id="logout-form" action="https://mis.rp.ac.rw/logout" method="POST" className="d-none">
                        <input type="hidden" name="_token" value="3To1bq5UNUZH7mvt5ZAws2Lgp3zsarRjWfwl2bld" autoComplete="off" />
                    </form>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
