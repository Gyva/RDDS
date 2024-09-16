import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);

    if (!isAuthenticated) {
        // If the user is not authenticated, redirect to login
        return <Navigate to="/login" />;
    }

    // If authenticated, render the children components
    return children;
};

export default ProtectedRoute;
