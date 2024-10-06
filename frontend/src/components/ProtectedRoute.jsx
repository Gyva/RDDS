import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthProvider';

const ProtectedRoute = ({ children }) => {
    const { auth } = useContext(AuthContext);
    const location = useLocation();

    if (auth.isAuthenticated) {
        console.log("isAuthenticated State is: ", auth.isAuthenticated);

        // Navigate based on current location
        if (location.from === '/dashboard') {
            return <Navigate to="/dashboard" state={{ from: location }} />;
        }
        if (location.from === '/levels') {
            return <Navigate to="/levels" state={{ from: location }} />;
        }
        if (location.from === '/discover') {
            return <Navigate to="/discover" state={{ from: location }} />;
        }
        if (location.from === '/departments') {
            return <Navigate to="/departments" state={{ from: location }} />;
        }
        if (location.from === '/students') {
            return <Navigate to="/students" state={{ from: location }} />;
        }
        if (location.from === '/faculties') {
            return <Navigate to="/faculties" state={{ from: location }} />;
        }
        if (location.from === '/create-project') {
            return <Navigate to="/create-project" state={{ from: location }} />;
        }
        if (location.from === '/register-supervisor') {
            return <Navigate to="/register-supervisor" state={{ from: location }} />;
        }
        if (location.from === '/register-student') {
            return <Navigate to="/register-student" state={{ from: location }} />;
        }
        if (location.from === '/supervisors') {
            return <Navigate to="/supervisors" state={{ from: location }} />;
        }
        if (location.from === '/change-password') {
            return <Navigate to="/change-password" state={{ from: location }} />;
        }
        if (location.from === '/manage-project') {
            return <Navigate to="/manage-project" state={{ from: location }} />;
        }
        // Safeguard against undefined from before using startsWith()
        // New logic for matching dynamic routes without startsWith
        if (location.from && /\/projects\/\d+/.test(location.from)) {
            return <Navigate to={location.from} state={{ from: location }} />;
        }

    }

    return children;
};

export default ProtectedRoute;
