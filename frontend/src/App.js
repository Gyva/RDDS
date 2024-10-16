import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; // Import the CSS styles here
import Login from './components/Login';
import AuthProvider from './contexts/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import DepartmentsDisplay from './components/DepartmentsDisplay';
import FacultiesDisplay from './components/FacultiesDisplay';
import LevelsDisplay from './components/LevelsDisplay';
import StudentsDisplay from './components/StudentsDisplay';
import PasswordResetForm from './components/PasswordResetForm';
import GrabResetLink from './components/GrabResetLink';
import CreateProject from './components/CreateProject';
import SupervisorRegistrationForm from './components/SupervisorRegistrationForm';
import StudentRegistrationForm from './components/StudentRegistrationForm';
import SupervisorsDisplay from './components/SupervisorsDisplay';
import ChangePasswordForm from './components/ChangePasswordForm';
import Discover from './components/Discover'; // Import the Discover component
import ProjectBlogPage from './components/ProjectBlogPage'; // Import the ProjectBlogPage component
import Dashboard from './components/Dashboard';
import GetPasswordForm from './components/GetPasswordForm';
import SetPassword from './components/SetPassword';
import ManageSubmittedProjects from './components/ManageSubmittedProjects';
import Chat from './components/Chat';
import ConversationsList from './components/ConversationsList';
import RegistrarRegistrationForm from './components/RegistrarRegistrationForm';
import PDFViewer from './components/PDFViewer';
import ManageRegistrar from './components/ManageRegistrar';
import DepartmentReport from './components/DepartmentReport';
import StudentAssignedProject from './components/StudentAssignedProject';

function App() {
    return (
        <>
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public Route for Login */}
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/reset-password/:uid/:token" element={<PasswordResetForm />} />
                    <Route path="/grab-reset-link" element={<GrabResetLink />} />
                    <Route path="/claim-password" element={<GetPasswordForm />} />
                    <Route path="/set-password" element={<SetPassword />} />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard><LevelsDisplay /></Dashboard></ProtectedRoute>} />
                    <Route path="/home" element={<ProtectedRoute><Dashboard><Discover /></Dashboard></ProtectedRoute>} />
                    <Route path="/discover" element={<ProtectedRoute><Dashboard><Discover /></Dashboard></ProtectedRoute>} /> {/*for hod/supervisor/student/admin/registrar */}
                    <Route path="/departments" element={<ProtectedRoute><Dashboard><DepartmentsDisplay /></Dashboard></ProtectedRoute>} />{/*for registar  and admin */}
                    <Route path="/levels" element={<ProtectedRoute><Dashboard><LevelsDisplay /></Dashboard></ProtectedRoute>} />{/*for registar  and admin */}
                    <Route path="/students" element={<ProtectedRoute><Dashboard><StudentsDisplay /></Dashboard></ProtectedRoute>} />{/*for registar  and admin */}
                    <Route path="/faculties" element={<ProtectedRoute><Dashboard><FacultiesDisplay /></Dashboard></ProtectedRoute>} />{/*for registar  and admin */}
                    <Route path="/create-project" element={<ProtectedRoute><Dashboard><CreateProject /></Dashboard></ProtectedRoute>} />{/*for supervisor/HOD/student */}
                    <Route path="/register-supervisor" element={<ProtectedRoute><Dashboard><SupervisorRegistrationForm /></Dashboard></ProtectedRoute>} />{/*for registar  and admin */}
                    <Route path="/register-student" element={<ProtectedRoute><Dashboard><StudentRegistrationForm /></Dashboard></ProtectedRoute>} />{/*for registar  and admin */}
                    <Route path="/supervisors" element={<ProtectedRoute><Dashboard><SupervisorsDisplay /></Dashboard></ProtectedRoute>} />{/*for registar  and admin */}
                    <Route path="/change-password" element={<ProtectedRoute><Dashboard><ChangePasswordForm /></Dashboard></ProtectedRoute>} /> {/* for all */}
                    <Route path="/projects/:id" element={<ProtectedRoute><Dashboard><ProjectBlogPage /></Dashboard></ProtectedRoute>} />{/*for registar  and admin */}
                    <Route path="/manage-projects" element={<ProtectedRoute><Dashboard><ManageSubmittedProjects /></Dashboard></ProtectedRoute>} />{/*for HOD  and admin */}
                    <Route path="/chat" element={<ProtectedRoute><Dashboard><Chat /></Dashboard></ProtectedRoute>} />{/*for student/ */}
                    <Route path="/conversations" element={<ProtectedRoute><Dashboard><ConversationsList /></Dashboard></ProtectedRoute>} />{/*for hod/supervisor*/}
                    <Route path="/create-regstrar" element={<ProtectedRoute><Dashboard><RegistrarRegistrationForm /></Dashboard></ProtectedRoute>} />{/*for admin */}
                    <Route path="/view-pdf" element={<ProtectedRoute><Dashboard><PDFViewer /></Dashboard></ProtectedRoute>} />{/*for supervisor/HOD/student */}
                    <Route path="/manage-registrar" element={<ProtectedRoute><Dashboard><ManageRegistrar /></Dashboard></ProtectedRoute>} />{/*for admin */}
                    <Route path="/my-department" element={<ProtectedRoute><Dashboard><DepartmentReport /></Dashboard></ProtectedRoute>} />{/*for admin */}
                    <Route path="/my-projects" element={<ProtectedRoute><Dashboard><StudentAssignedProject /></Dashboard></ProtectedRoute>} />{/*for admin */}
                    

                    
                </Routes>
            </AuthProvider>
        </Router>
        </>
    );
}

export default App;
