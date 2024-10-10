import React, { useContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Sidebar.css';
import { AuthContext } from '../contexts/AuthProvider';
import { useNavigate } from 'react-router-dom'; // To handle navigation

const Sidebar = ({ isVisible, role }) => {
  const [students,setStudents] = useState()
    const [supervisors, setSupervisors] = useState() 
  const { auth, api } = useContext(AuthContext);
  const navigate = useNavigate();

  // Function to handle chat menu click
  const handleChatClick = async () => {
    try {
      let studentId,supervisorId, projectId, conversationId;

      // Check user role and fetch the necessary IDs
      if (auth.role?.toUpperCase() === 'STUDENT') {
        const studentResponse = await api.get(`http://127.0.0.1:8000/api/students/`);
        console.log(studentResponse.data)
        studentId = studentResponse.data?.find((student) => student.reg_num === auth.user)
        studentId = studentId.st_id
        
        console.log("Student ID: "+students)

        const projectsResponse = await api.get(`http://127.0.0.1:8000/api/projects/?student=${studentId}`);
        projectId = projectsResponse.data[0].project_id;
        console.log("Project ID: "+projectId)

      } else if (auth.role?.toUpperCase() === 'SUPERVISOR' || auth.role?.toUpperCase() === 'HOD' ) {
        console.log("The logged User role is: "+auth.role)
        const supervisorResponse = await api.get(`http://127.0.0.1:8000/api/supervisors/`);
        setSupervisors(supervisorResponse.data);
        console.log(supervisorResponse.data)
        supervisorId = supervisorResponse.data?.find((supervisor) => supervisor.reg_num === auth.user)
        supervisorId = supervisorId.sup_id
        
        const projectsResponse = await api.get(`http://127.0.0.1:8000/api/projects/?supervisor=${supervisorId}`);
        projectId = projectsResponse.data[0].project_id;
        console.log("Project ID: "+projectId)
      }
      console.log("Supervisor ID: "+ supervisorId)
      // Fetch the conversation ID for the project
      const conversationResponse = await api.get(`http://127.0.0.1:8000/api/conversations/?project_id=${projectId}`);
      conversationId = conversationResponse.data[0].id;

      console.log("Conversation ID: "+conversationId)
      // console.log(`Student ID: ${studentId} Project ID: ${projectId} Conversation ID: ${conversationId}`)

      // Navigate to the chat component, passing IDs through navigation state
      navigate('/chat', { state: { studentId, projectId, conversationId } });

    } catch (error) {
      console.error('Error fetching chat data:', error);
    }
  };

  const commonMenus = (
    <li className="nav-item">
      <a href="/home" className="nav-link">
        <i className="nav-icon fas fa-home me-2"></i> Home
      </a>
    </li>
  );

  const roleMenus = {
    // Define different menus for each role
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
        {/* Chat menu item for supervisor */}
        <li className="nav-item">
          <a href="#!" onClick={() => navigate('/conversations')} className="nav-link">
            <i className="nav-icon fas fa-comments me-2"></i> Chats
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
        {/* Chat menu item for supervisor */}
        <li className="nav-item">
          <a href="#!" onClick={handleChatClick} className="nav-link">
            <i className="nav-icon fas fa-comments me-2"></i> Chat
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
        {/* Chat menu item for student */}
        <li className="nav-item">
          <a href="#!" onClick={handleChatClick} className="nav-link">
            <i className="nav-icon fas fa-comments me-2"></i> Chat
          </a>
        </li>
      </>
    )
  };

  return (
    <aside className={`main-sidebar ${isVisible ? '' : 'd-none'}`}>
      <a href="/" className="brand-link">
        <span className="brand-text">{auth.user?.toUpperCase()}</span>
      </a>

      <div className="sidebar">
        <div className="user-panel d-flex align-items-center">
          <div className="info">
            <p className="text-white">KWIZERA Ferdinand</p>
          </div>
        </div>
        <hr className='text-secondary' />
        <nav>
          <ul className="nav flex-column">
            {commonMenus}
            {roleMenus[role] || null}
          </ul>
        </nav>
      </div>

      <div className="sidebar-footer text-center p-3">
        <span className="fs-6 text-white">{role}</span>
      </div>
    </aside>
  );
};

export default Sidebar;
