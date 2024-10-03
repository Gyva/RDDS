import React, { useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Sidebar.css'; // Ensure this CSS file exists
import { AuthContext } from '../../contexts/AuthProvider';

const Sidebar = ({ isVisible, role }) => {
  const { auth } = useContext(AuthContext);
  
  const commonMenus = (
    <li className="nav-item">
      <a href="/home" className="nav-link">
        <i className="nav-icon fas fa-home me-2"></i> Home
      </a>
    </li>
  );

  const roleMenus = {
    hod: (
      <>
        <li className="nav-item">
          <a href="/hod/departments" className="nav-link">
            <i className="nav-icon fas fa-building me-2"></i> Manage Departments
          </a>
        </li>
        <li className="nav-item">
          <a href="/hod/reports" className="nav-link">
            <i className="nav-icon fas fa-chart-line me-2"></i> View Reports
          </a>
        </li>
      </>
    ),
    registerer: (
      <>
        <li className="nav-item">
          <a href="/registerer/students" className="nav-link">
            <i className="nav-icon fas fa-user me-2"></i> Manage Students
          </a>
        </li>
        <li className="nav-item">
          <a href="/registerer/payments" className="nav-link">
            <i className="nav-icon fas fa-money-check-alt me-2"></i> Handle Payments
          </a>
        </li>
      </>
    ),
    supervisor: (
      <>
        <li className="nav-item">
          <a href="/supervisor/projects" className="nav-link">
            <i className="nav-icon fas fa-tasks me-2"></i> Manage Projects
          </a>
        </li>
        <li className="nav-item">
          <a href="/supervisor/students" className="nav-link">
            <i className="nav-icon fas fa-users me-2"></i> Supervise Students
          </a>
        </li>
      </>
    ),
    student: (
      <>
        <li className="nav-item">
          <a href="" className="nav-link">
            <i className="nav-icon fas fa-file-alt me-2"></i> Admission Letter
          </a>
        </li>
        <li className="nav-item">
          <a href="" className="nav-link">
            <i className="nav-icon fas fa-money-check-alt me-2"></i> Payments
          </a>
        </li>
        <li className="nav-item">
          <a href="" className="nav-link">
            <i className="nav-icon fas fa-tasks me-2"></i> Academic Marks
          </a>
        </li>
        <li className="nav-item">
          <a href="" className="nav-link">
            <i className="nav-icon fas fa-certificate me-2"></i> Clearance
          </a>
        </li>
      </>
    )
  };

  return (
    <aside className={`main-sidebar ${isVisible ? '' : 'd-none'}`}>
      {/* Brand Logo */}
      <a href="/" className="brand-link">
        <img src="" className="brand-image" style={{ opacity: '.8' }} alt="brand logo" />
        <span className="brand-text">{auth.user?.toUpperCase()}</span>
      </a>

      {/* Sidebar */}
      <div className="sidebar">
        {/* Sidebar user panel */}
        <div className="user-panel d-flex align-items-center">
          <div className="image">
            <img src="" alt="User" />
          </div>&nbsp;&nbsp;
          <div className="info">
            <p className="text-white">KWIZERA Ferdinand</p>
          </div>
        </div>
        <hr className='text-secondary' />
        {/* Sidebar Menu */}
        <nav>
          <ul className="nav flex-column">
            {commonMenus}
            {roleMenus[role] || null}
          </ul>
        </nav>
      </div>

      {/* Sidebar footer */}
      <div className="sidebar-footer text-center p-3">
        <span className="fs-6 text-white">{role}</span>
      </div>
    </aside>
  );
};

export default Sidebar;
