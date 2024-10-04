import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../contexts/AuthProvider';
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

  return (
    <div className="login-container">
      <div className="card p-4">
        <section>
          <p className={errMsg ? "alert alert-danger" : "d-none"}>{errMsg}</p>
          <h2 className="text-center mb-4"><b>RP::Project</b>&nbsp;Login In</h2>
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

            <button className="btn btn-primary w-100">Sign In</button>
          </form>
          <button className="claim-password btn" onClick={() => navigate('/claim-password')}>Claim Password</button>
        </section>
      </div>
    </div>
  );
};

export default Login;
