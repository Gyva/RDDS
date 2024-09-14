import React from 'react';
import './Navbar.css'; // Import the CSS file

const Navbar = ({ toggleSidebar, isVisible }) => {
    const handleLogout = (e) => {
        e.preventDefault();
        document.getElementById('logout-form').submit();
    };

    const navigateToPage = (url) => {
        window.location.href = url; // Redirect to the specified URL
    };

    return (
        <nav className={`main-header navbar navbar-expand navbar-white navbar-light`}>
            {/* Left navbar links */}
            <ul className="navbar-nav ms-5">
                <li className="nav-item">
                    <button className="nav-link sidebar-toggle" onClick={toggleSidebar}>
                        <i className="fas fa-bars"></i>
                    </button>
                </li>
                <li className="nav-item d-none d-sm-inline-block">
                    <p className="nav-link" onClick={() => navigateToPage('#')}>Welcome Ngoma College</p>
                </li>
            </ul>
            {/* Right navbar links */}
            <ul className="navbar-nav me-5 fixed">
                <li className="">
                    <p className="nav-link btn btn-default btn-flat" onClick={() => navigateToPage('#')}>2023 - 2024</p>
                </li>
                <li>
                    <p className="nav-link" onClick={handleLogout}>
                        Logout <i className="fas fa-sign-out-alt"></i>
                    </p>
                </li>
                <form id="logout-form" action="https://mis.rp.ac.rw/logout" method="POST" className="d-none">
                    <input type="hidden" name="_token" value="3To1bq5UNUZH7mvt5ZAws2Lgp3zsarRjWfwl2bld" autoComplete="off" />
                </form>
            </ul>
        </nav>
    );
};

export default Navbar;
