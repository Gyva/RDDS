import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/public/Login/Login';
import Navbar from './components/users/Navbar';
import Sidebar from './components/users/Sidebar';
import './App.css'; // Import the CSS styles here
import AuthProvider from './contexts/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import DepartmentsDisplay from './components/users/Hod/Departments/DepartmentsDisplay';
import FacultiesDisplay from './components/users/Hod/Faculties/FacultiesDisplay';
import LevelsDisplay from './components/users/Hod/Levels/LevelsDisplay';
import StudentsDisplay from './components/users/registerer/Student/StudentsDisplay';
import PasswordResetForm from './components/public/Password/PasswordResetForm';
import GrabResetLink from './components/public/Password/GrabResetLink';
import CreateProject from './components/users/CreateProject';
import SupervisorRegistrationForm from './components/users/Hod/Supervisors/SupervisorRegistrationForm';
import StudentRegistrationForm from './components/users/registerer/Student/StudentRegistrationForm';
import SupervisorsDisplay from './components/users/Hod/Supervisors/SupervisorsDisplay';
import ChangePasswordForm from './components/users/ChangePasswordForm';
import Discover from './components/users/Discover'; // Import the Discover component
import ProjectBlogPage from './components/users/ProjectBlogPage'; // Import the ProjectBlogPage component
import Dashboard from './components/users/Dashboard';
import GetPasswordForm from './components/public/Password/GetPasswordForm';
import SetPassword from './components/public/Password/SetPassword';

function App() {
    return (
        <>
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public Route for Login */}
                    <Route path="/" element={<Login />} />
                    <Route path="/reset-password/:uid/:token" element={<PasswordResetForm />} />
                    <Route path="/grab-reset-link" element={<GrabResetLink />} />
                    <Route path="/claim-password" element={<GetPasswordForm />} />
                    <Route path="/set-password" element={<SetPassword />} />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard><LevelsDisplay /></Dashboard></ProtectedRoute>} />
                    <Route path="/discover" element={<ProtectedRoute><Dashboard><Discover /></Dashboard></ProtectedRoute>} />
                    <Route path="/departments" element={<ProtectedRoute><Dashboard><DepartmentsDisplay /></Dashboard></ProtectedRoute>} />
                    <Route path="/levels" element={<ProtectedRoute><Dashboard><LevelsDisplay /></Dashboard></ProtectedRoute>} />
                    <Route path="/students" element={<ProtectedRoute><Dashboard><StudentsDisplay /></Dashboard></ProtectedRoute>} />
                    <Route path="/faculties" element={<ProtectedRoute><Dashboard><FacultiesDisplay /></Dashboard></ProtectedRoute>} />
                    <Route path="/create-project" element={<ProtectedRoute><Dashboard><CreateProject /></Dashboard></ProtectedRoute>} />
                    <Route path="/register-supervisor" element={<ProtectedRoute><Dashboard><SupervisorRegistrationForm /></Dashboard></ProtectedRoute>} />
                    <Route path="/register-student" element={<ProtectedRoute><Dashboard><StudentRegistrationForm /></Dashboard></ProtectedRoute>} />
                    <Route path="/supervisors" element={<ProtectedRoute><Dashboard><SupervisorsDisplay /></Dashboard></ProtectedRoute>} />
                    <Route path="/change-password" element={<ProtectedRoute><Dashboard><ChangePasswordForm /></Dashboard></ProtectedRoute>} />
                    <Route path="/projects/:id" element={<ProtectedRoute><Dashboard><ProjectBlogPage /></Dashboard></ProtectedRoute>} />
                    
                </Routes>
            </AuthProvider>
        </Router>
        </>
    );
}

export default App;
