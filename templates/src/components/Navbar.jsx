// src/Navbar.jsx
import React from 'react';
import './Navbar.css'; // Import the CSS file

const Navbar = ({ toggleSidebar, isVisible  }) => {
    const handleLogout = (e) => {
        e.preventDefault();
        document.getElementById('logout-form').submit();
    };

    return (
        <nav className={`main-header navbar navbar-expand navbar-white navbar-light ${isVisible ? 'w-75' : ''}`}>
            {/* Left navbar links */}
            <ul className="navbar-nav ms-5">
                <li className="nav-item">
                    <button className="nav-link sidebar-toggle" onClick={toggleSidebar}>
                        <i className="fas fa-bars"></i>
                    </button>
                </li>
                <li className="nav-item d-none d-sm-inline-block">
                    <a href="#" className="nav-link">Welcome Ngoma College</a>
                </li>
            </ul>
            {/* Right navbar links */}
            <ul className="navbar-nav me-5">
                <li className="">
                    <a href="#" className="nav-link btn btn-default btn-flat">2023 - 2024</a>
                </li>
                <li>
                    <a href="#" onClick={handleLogout} className="nav-link">
                        Logout <i className="fas fa-sign-out-alt"></i>
                    </a>
                </li>
                <form id="logout-form" action="https://mis.rp.ac.rw/logout" method="POST" className="d-none">
                    <input type="hidden" name="_token" value="3To1bq5UNUZH7mvt5ZAws2Lgp3zsarRjWfwl2bld" autoComplete="off" />
                </form>
            </ul>
        </nav>
    );
};

export default Navbar;
