import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './pwdstyles.css';
import axios from 'axios';

const GrabResetLink = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [accountUsername, setAccountUsername] = useState('');
    const [accountEmail, setAccountEmail] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const URL = "http://127.0.0.1:8000/api/password-reset/";
            const response = await axios.post(URL, {
                username: accountUsername,
                email: accountEmail
            });

            const result = await response.data;

            if (response.status === 200 && result) {
                setSuccess(result.message);
                setError(null);
            } else {
                setError(result.message);
                setSuccess(null);
            }
        } catch (error) {
            console.error('Search error:', error.message);
            setError('An error occurred while sending the reset link. Please try again.');
            setSuccess(null);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="card shadow">
                            <div className="card-body p-4">
                                <h2 className="text-center mb-4"><b>RP::Project</b></h2> {/* Added the project title */}
                                
                                <h2 className="text-center mb-4">Grab Password Reset Link</h2>

                                {error && <div className="alert alert-danger text-center">{error}</div>}
                                {success && <div className="alert alert-success text-center">{success}</div>}

                                <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column">
                                    <div className="form-group mb-3">
                                        <label htmlFor="acc_username">Account Username:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="acc_username"
                                            value={accountUsername}
                                            onChange={(e) => setAccountUsername(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="acc_email">Account Email:</label>
                                        <input
                                            type="email" // Changed to 'email' for validation
                                            className="form-control"
                                            id="acc_email"
                                            value={accountEmail}
                                            onChange={(e) => setAccountEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100">Send Password Reset Link</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GrabResetLink;
