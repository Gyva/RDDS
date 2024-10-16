import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState({
    id:null,
    isAuthenticated: JSON.parse(localStorage.getItem("isAuthenticated")) || false,
    user: null,
    role: null,
    accessToken: localStorage.getItem('token'),
  });

  // Function to refresh the token
  const refreshToken = async () => {
    try {
      const refresh_token = localStorage.getItem('refresh_token');
      const expired_access_token = localStorage.getItem('token'); // Get expired access token

      if (!refresh_token) {
        throw new Error('No refresh token available');
      }

      // Make the refresh request with the expired access token in the headers and the refresh token in the body
      const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', 
      {
        refresh: refresh_token // Send refresh token in the body
      },
      {
        headers: {
          'Authorization': `Bearer ${expired_access_token}`, // Send expired access token in Authorization header
        }
      });

      const { access } = response.data;

      // Update the access token and store it
      setAuth((prev) => ({ ...prev, accessToken: access }));
      localStorage.setItem('token', access);

      return access;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout(); // Handle logout if refresh fails
    }
  };

  const logout = () => {
    setAuth({
      isAuthenticated: false,
      id:null,
      user: null,
      role: null,
      accessToken: null,
    });
    localStorage.clear(); // Clear user data
    navigate('/');
  };

  useEffect(() => {
    const checkAuthStatus = () => {
      const savedId = localStorage.getItem('id')
      const savedUser = localStorage.getItem('user');
      const savedRole = localStorage.getItem('role');
      const savedAccessToken = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refresh_token');

      if (savedId && savedUser && savedAccessToken && refreshToken) {
        setAuth({
          id : savedId,
          isAuthenticated: true,
          user: savedUser,
          role: savedRole,
          accessToken: savedAccessToken,
        });
      }
    };

    checkAuthStatus();
  }, []);

  // Axios instance with interceptor
  const api =  axios.create();

  api.interceptors.request.use(
    async (config) => {
      const token = auth.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const newAccessToken = await refreshToken(); // Refresh the token
        axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest); // Retry the failed request with new token
      }

      return Promise.reject(error);
    }
  );

  return (
    <AuthContext.Provider value={{ auth, setAuth, api, logout, refreshToken }}> {/* Add refreshToken here */}
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
