// src/Sidebar.jsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Sidebar.css'; // Ensure this CSS file exists

const Sidebar = ({ isVisible }) => {
  return (
    <aside className={`main-sidebar ${isVisible ? '' : 'd-none'}`}>
      {/* Brand Logo */}
      <a href="" className="brand-link">
        <img src="" alt="RP" className="brand-image" style={{ opacity: '.8' }} />
        <span className="brand-text">21RP12272</span>
      </a>

      {/* Sidebar */}
      <div className="sidebar">
        {/* Sidebar user panel */}
        <div className="user-panel">
          <div className="image">
            <img src="" alt="User" />
          </div>
          <div className="info">
            <a href="">KWIZERA Ferdinand</a>
          </div>
        </div>

        {/* Sidebar Menu */}
        <nav>
          <ul className="nav">
            <li className="nav-item">
              <a href="" target="_blank" rel="noopener noreferrer">
                <i className="nav-icon fas fa-copy"></i>
                Admission Letter
              </a>
            </li>
            <li className="nav-item">
              <a href="" target="_blank" rel="noopener noreferrer">
                <i className="nav-icon fas fa-copy"></i>
                Proof of Registration
              </a>
            </li>
            <li className="nav-item">
              <a href="">
                <i className="nav-icon fas fa-edit"></i>
                Registration
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link" data-toggle="collapse" data-target="#paymentsMenu">
                <i className="nav-icon fas fa-money-check-alt"></i>
                Payments
                <i className="right fas fa-angle-left"></i>
              </a>
              <ul className="nav collapse" id="paymentsMenu">
                <li className="nav-item">
                  <a href="">
                    <i className="far fa-circle nav-icon"></i>
                    Make Payment
                  </a>
                </li>
                <li className="nav-item">
                  <a href="">
                    <i className="far fa-circle nav-icon"></i>
                    Payment History
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a href="https://mis.rp.ac.rw/student/marks">
                <i className="nav-icon fas fa-tasks"></i>
                Academic Marks
              </a>
            </li>
            <li className="nav-item">
              <a href="https://mis.rp.ac.rw/student/clearance">
                <i className="nav-icon fas fa-certificate"></i>
                Clearance
              </a>
            </li>
            {/* <li className="nav-item">
              <a href="https://mis.rp.ac.rw/student/security">
                <i className="nav-icon fas fa-shield-alt"></i>
                Security
              </a>
            </li> */}
          </ul>
        </nav>
      </div>

      {/* Sidebar footer */}
      <div className="sidebar-footer">
        <div className="footer-content">
          <div className="fs-5">Hod</div>
          <label>/</label>
          <div className="fs-5">Jean Paul</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
