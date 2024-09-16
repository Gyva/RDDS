import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'

// Create a context for authentication
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // const [authToken, setAuthToken] = useState(null);
    const [loggedUser, setLoggedUser] = useState();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

     // Check if the user is already logged in when the app starts
     useEffect(() => {
        const token = Cookies.get('User');
        if (token) {
            setLoggedUser(Cookies.get('User'));
            setIsAuthenticated(true);
            navigate('/dashboard')
        }
    }, []);

    // Function to handle login
    const login = (id, role) => {
        Cookies.set('User', id, { expires: 7 }); // Set cookie for user ID with expiration
        Cookies.set('role', role, { expires: 7 }); // Set cookie for role with expiration
        // Cookies.set('authToken', token, { expires: 7 }); // Set token in cookies (7 days expiration)
        // setLoggedUser(id);
        setIsAuthenticated(true);
        navigate('/dashboard'); // Redirect after login
    };

    // Function to handle logout
    const logout = () => {
        // Cookies.remove('authToken'); // Remove token from cookies
        Cookies.remove('User');      // Remove user ID from cookies
        Cookies.remove('role');      // Remove role from cookies
        setLoggedUser(null);
        setIsAuthenticated(false);
        navigate('login'); // Redirect to login page after logout
    };
    return (
        <AuthContext.Provider value={{ loggedUser,isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
