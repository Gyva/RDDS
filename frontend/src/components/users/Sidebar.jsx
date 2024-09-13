import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Sidebar.css'; // Ensure this CSS file exists

const Sidebar = ({ isVisible, role }) => {
  const commonMenus = (
    <>
      <li className="nav-item">
        <a href="/home">
          <i className="nav-icon fas fa-home"></i>
          Home
        </a>
      </li>
    </>
  );

  const hodMenus = (
    <>
      <li className="nav-item">
        <a href="/hod/departments">
          <i className="nav-icon fas fa-building"></i>
          Manage Departments
        </a>
      </li>
      <li className="nav-item">
        <a href="/hod/reports">
          <i className="nav-icon fas fa-chart-line"></i>
          View Reports
        </a>
      </li>
    </>
  );

  const registererMenus = (
    <>
      <li className="nav-item">
        <a href="/registerer/students">
          <i className="nav-icon fas fa-user"></i>
          Manage Students
        </a>
      </li>
      <li className="nav-item">
        <a href="/registerer/payments">
          <i className="nav-icon fas fa-money-check-alt"></i>
          Handle Payments
        </a>
      </li>
    </>
  );

  const supervisorMenus = (
    <>
      <li className="nav-item">
        <a href="/supervisor/projects">
          <i className="nav-icon fas fa-tasks"></i>
          Manage Projects
        </a>
      </li>
      <li className="nav-item">
        <a href="/supervisor/students">
          <i className="nav-icon fas fa-users"></i>
          Supervise Students
        </a>
      </li>
    </>
  );

  const studentMenus = (
    <>
      <li className="nav-item">
        <a href="/student/admission-letter">
          <i className="nav-icon fas fa-file-alt"></i>
          Admission Letter
        </a>
      </li>
      <li className="nav-item">
        <a href="/student/payments">
          <i className="nav-icon fas fa-money-check-alt"></i>
          Payments
        </a>
        <ul className="nav collapse" id="paymentsMenu">
          <li className="nav-item">
            <a href="/student/make-payment">
              <i className="far fa-circle nav-icon"></i>
              Make Payment
            </a>
          </li>
          <li className="nav-item">
            <a href="/student/payment-history">
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
    </>
  );

  const renderMenus = () => {
    switch (role) {
      case 'hod':
        return hodMenus;
      case 'registerer':
        return registererMenus;
      case 'supervisor':
        return supervisorMenus;
      case 'student':
        return studentMenus;
      default:
        return null;
    }
  };

  return (
    <aside className={`main-sidebar ${isVisible ? '' : 'd-none'}`}>
      {/* Brand Logo */}
      <a href="/" className="brand-link">
        <img src="" alt="RP" className="brand-image" style={{ opacity: '.8' }} />
        <span className="brand-text">21RP12272</span>
      </a>

      {/* Sidebar */}
      <div className="sidebar">
        {/* Sidebar user panel */}
        <div className="user-panel d-flex justify-content-between">
          <div className="image ms-3">
            <img src="" alt="User" />
          </div>
          <div className="info me-3 fw-100">
            <p >KWIZERA Ferdinand</p>
          </div>
        </div>
        <hr className='text-secondary' />
        {/* Sidebar Menu */}
        <nav>
          <ul className="nav">
            {commonMenus}
            {renderMenus()}
          </ul>
        </nav>
      </div>

      {/* Sidebar footer */}
      <div className="sidebar-footer">
        <div className="footer-content">
          <div className="fs-5">{role}</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
