import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthProvider';

const ProtectedRoute = ({ children }) => {
    const {auth} = useContext(AuthContext);
    const location = useLocation(); 
    

    if (!auth.isAuthenticated) {
        console.log("isAuthenticated State is: ", auth.isAuthenticated)
        
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return children;
};

export default ProtectedRoute;
