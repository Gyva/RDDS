import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthProvider';
import './Login.css';

const LOGIN_URL = 'http://127.0.0.1:8000/api/login/';

const Login = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(LOGIN_URL,
        JSON.stringify({ username: email, password }),
        { headers: { 'Content-Type': 'application/json' } }
      );

      const result = response?.data;
      const { id, username, role, access_token, refresh_token } = result;

      // Save data in localStorage
      localStorage.setItem('id', id);
      localStorage.setItem('user', username);
      localStorage.setItem('role', role);
      localStorage.setItem('token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      // Update the auth context
      setAuth({ id: id, username, role, accessToken: access_token, isAuthenticated: true });

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

  if(auth.isAuthenticated) {
    navigate('/dashboard');
  }

  return (
    <div className="login-container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4"><b>RP::Project</b>&nbsp;Login</h2>
        {errMsg && <p className="alert alert-danger">{errMsg}</p>}
        <form onSubmit={handleSubmit}>
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

          <button type="submit" className="btn btn-primary w-100">Sign In</button>
        </form>
        <div className="text-center mt-3">
          <button className="btn btn-link" onClick={() => navigate('/claim-password')}>Claim Password</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
