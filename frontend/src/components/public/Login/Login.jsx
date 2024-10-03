import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../contexts/AuthProvider'; // Keep the original context import
import './Login.css';

const LOGIN_URL = 'http://127.0.0.1:8000/api/login/';

const Login = () => {
  const { auth, setAuth } = useContext(AuthContext); // Keep the original usage of AuthContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ username: email, password }),
        { headers: { 'Content-Type': 'application/json' } }
      );

      const result = response?.data;
      const { username, role, access_token, refresh_token } = result;

      // Save data in localStorage
      localStorage.setItem('user', username);
      localStorage.setItem('role', role);
      localStorage.setItem('token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      // Update the auth context
      setAuth({ user: username, role, accessToken: access_token, isAuthenticated: true });

      navigate('/dashboard'); // Redirect to dashboard on successful login

    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login Failed');
      }
    }
  };

  if (auth.isAuthenticated) {
    navigate("/dashboard");
  }

  return (
    <div className="login-container">
      <div className="card p-4">
        <section>
          <p className={errMsg ? "alert alert-danger" : "d-none"}>{errMsg}</p>
          <h1 className="text-center mb-4">Sign In</h1>
          <form onSubmit={handleSubmit} style={{ width: '300px' }}>
            <div className="form-group mb-3">
              <label htmlFor="email">Email/RegNo:</label>
              <input
                type="text"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                className="form-control"
              />
            </div>

            <div className="form-group mb-4">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                className="form-control"
              />
            </div>

            <button className="btn btn-primary w-100">Sign In</button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Login;
