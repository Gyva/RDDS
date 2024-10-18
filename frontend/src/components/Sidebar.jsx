import React, { useContext, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Sidebar.css';
import { AuthContext } from '../contexts/AuthProvider';
import { useNavigate } from 'react-router-dom'; // To handle navigation

const Sidebar = ({ isVisible, role }) => {
  const [students, setStudents] = useState()
  const [supervisors, setSupervisors] = useState()
  const { auth, api } = useContext(AuthContext);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchuser();
  }, [auth.id])

  // Function to handle chat menu click
  const handleChatClick = async () => {
    try {

      let studentId, supervisorId, projectId, conversationId;

      // Check user role and fetch the necessary IDs
      if (auth.role?.toUpperCase() === 'STUDENT') {
        const studentResponse = await api.get(`http://127.0.0.1:8000/api/students/`);
        console.log(studentResponse.data)
        studentId = studentResponse.data?.find((student) => student.reg_no === auth.user)
        console.log(studentId)
        studentId = studentId.st_id

        console.log(studentId)

        const projectsResponse = await api.get(`http://127.0.0.1:8000/api/projects/`);
        projectId = projectsResponse.data?.find((project) => (project.student_id === studentId || project.collaborators.includes(studentId)));
        projectId = projectId.project_id
        console.log(projectId)

      } else if (auth.role?.toUpperCase() === 'SUPERVISOR' || auth.role?.toUpperCase() === 'HOD') {
        console.log("The logged User role is: " + auth.role)
        const supervisorResponse = await api.get(`http://127.0.0.1:8000/api/supervisors/`);
        setSupervisors(supervisorResponse.data);
        console.log(supervisorResponse.data)
        supervisorId = supervisorResponse.data?.find((supervisor) => supervisor.reg_num === auth.user)
        supervisorId = supervisorId.sup_id

        const projectsResponse = await api.get(`http://127.0.0.1:8000/api/projects/`);
        projectId = projectsResponse.data?.find((project) => project.supervisor_id === supervisorId);
        projectId = projectId.project_id
      }
      // Fetch the conversation ID for the project
      const conversationResponse = await api.get(`http://127.0.0.1:8000/api/conversations/`);
      const conversation = await conversationResponse.data.find((c) => c.project === projectId)
      console.log("Consoling: ", conversation)
      conversationId = conversation?.id;
      if (conversationId === null) {
        alert("You have no ongoing chats")
      }

      // console.log("Conversation ID: " + conversationId)
      // console.log(`Student ID: ${studentId} Project ID: ${projectId} Conversation ID: ${conversationId}`)

      // Navigate to the chat component, passing IDs through navigation state
      navigate('/chat', { state: { studentId, projectId, conversationId } });

    } catch (error) {
      console.error('Error fetching chat data:', error);
      alert('You have no ongoing chats.')
    }
  };

  const fetchuser = async () => {
    if (auth.id) {
      try {
        const userResponse = await api.get(`http://127.0.0.1:8000/api/users/${auth.id}`);
        console.log(userResponse); // Log the full response
        setUser(userResponse?.data); // Set the user data after resolving the promise
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

  }

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
          <a href="/create-project" className="nav-link">
            <i className="nav-icon fas fa-clipboard-list me-2"></i> Register a project
          </a>
        </li>
        <li className="nav-item">
          <a href="/manage-projects" className="nav-link">
            <i className="nav-icon fas fa-file-alt me-2"></i> Submitted projects
          </a>
        </li>
        <li className="nav-item">
          <a href="/my-department" className="nav-link">
            <i className="nav-icon fas fa-sitemap me-2"></i> Departments Report
          </a>
        </li>
        {/* Chat menu item for supervisor */}
        <li className="nav-item">
          <a href="/conversations" className="nav-link">
            <i className="nav-icon fas fa-comments me-2"></i> Conversations
          </a>
        </li>
        <li className="nav-item">
          <a href="/change-password" className="nav-link">
            <i className="nav-icon fas fa-lock me-2"></i> Change Password

          </a>
        </li>
      </>

    ),
    register: (
      <>
        <li className="nav-item">
          <a href="/register-student" className="nav-link">
            <i className="nav-icon fas fa-user-plus me-2"></i> {/* User-plus icon for student registration */}
            Register a student
          </a>
        </li>

        <li className="nav-item">
          <a href="/students" className="nav-link">
            <i className="nav-icon fas fa-users me-2"></i> {/* Users icon for managing students */}
            Manage Students
          </a>
        </li>

        <li className="nav-item">
          <a href="/register-supervisor" className="nav-link">
            <i className="nav-icon fas fa-chalkboard-teacher me-2"></i> {/* Chalkboard-teacher icon for supervisor registration */}
            Register a supervisor
          </a>
        </li>

        <li className="nav-item">
          <a href="/supervisors" className="nav-link">
            <i className="nav-icon fas fa-user-tie me-2"></i> {/* User-tie icon for managing supervisors */}
            Manage Supervisors
          </a>
        </li>

        <li className="nav-item">
          <a href="/departments" className="nav-link">
            <i className="nav-icon fas fa-building me-2"></i> {/* Building icon for managing departments */}
            Manage Departments
          </a>
        </li>

        <li className="nav-item">
          <a href="/faculties" className="nav-link">
            <i className="nav-icon fas fa-university me-2"></i> {/* University icon for managing faculties */}
            Manage Faculties
          </a>
        </li>

        <li className="nav-item">
          <a href="/levels" className="nav-link">
            <i className="nav-icon fas fa-layer-group me-2"></i> {/* Layer-group icon for managing levels */}
            Manage Levels
          </a>
        </li>
        <li className="nav-item">
          <a href="/my-department" className="nav-link">
            <i className="nav-icon fas fa-sitemap me-2"></i> Departments Report
          </a>
        </li>

        <li className="nav-item">
          <a href="/change-password" className="nav-link">
            <i className="nav-icon fas fa-key me-2"></i> {/* Key icon for changing password */}
            Change Password
          </a>
        </li>
      </>

    ),
    supervisor: (
      <>
        <li className="nav-item">
          <a href="/create-project" className="nav-link">
            <i className="nav-icon fas fa-money-check-alt me-2"></i> Register a project
          </a>
        </li>
        <li className="nav-item">
          <a href={`/supervisor/projects/${auth.user}`} className="nav-link">
            <i className="nav-icon fas fa-tasks me-2"></i> Assigned Projects
          </a>
        </li>
        <li className="nav-item">
          <a href="/supervisor/students" className="nav-link">
            <i className="nav-icon fas fa-users me-2"></i> Supervise Students
          </a>
        </li>
        {/* Chat menu item for supervisor */}
        <li className="nav-item">
          <a href="/conversations" className="nav-link">
            <i className="nav-icon fas fa-comments me-2"></i> Conversations
          </a>
        </li>
      </>
    ),
    student: (
      <>
        <li className="nav-item">
          <a href="/create-project" className="nav-link">
            <i className="nav-icon fas fa-money-check-alt me-2"></i> Register a Project
          </a>
        </li>
        <li className="nav-item">
          <a href={`/my-projects/${auth.user}`} className="nav-link">
            <i className="nav-icon fas fa-tasks me-2"></i> My Project(s)
          </a>
        </li>
        <li className="nav-item">
          <a href="#!" onClick={handleChatClick} className="nav-link">
            <i className="nav-icon fas fa-comments me-2"></i> Chat
          </a>
        </li>
        <li className="nav-item">
          <a href="/change-password" className="nav-link">
            <i className="nav-icon fas fa-lock me-2"></i> Change Password
          </a>
        </li>
      </>

    ),
    admin: (
      <>
        <li className="nav-item">
          <a href="/manage-projects" className="nav-link">
            <i className="nav-icon fas fa-money-check-alt me-2"></i> Manage projects
          </a>
        </li>
        <li className="nav-item">
          <a href="/manage-registrar" className="nav-link">
            <i className="nav-icon fas fa-tasks me-2"></i> Manage registrar
          </a>

        </li>
        <li className="nav-item">
          <a href="/change-password" className="nav-link">
            <i className="nav-icon fas fa-tasks me-2"></i> Change password
          </a>

        </li>
        <li className="nav-item">
          <a href="/re" onClick={handleChatClick} className="nav-link">
            <i className="nav-icon fas fa-comments me-2"></i> Chat
          </a>
        </li>
      </>
    )


  };

  return (
    <aside className={`main-sidebar ${isVisible ? '' : 'd-none'}`}>
      {/* {console.log(user)} */}
      <a href="/" className="brand-link">
        <span className="brand-text">{auth.user?.toUpperCase()}</span>
      </a>

      <div className="sidebar">
        <div className="user-panel d-flex align-items-center">
          <div className="info">
            <p className="text-white">{user?.first_name + " " + user?.last_name}</p>
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
