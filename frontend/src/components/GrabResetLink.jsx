import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './pwdstyles.css'
import axios from 'axios';

const GrabResetLink = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [accountUsername, setAccountUsername] = useState(null);
    const [accountEmail, setAccountEmail] = useState(null);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            // Determine the API endpoint based on the selected user type

            const URL = "http://127.0.0.1:8000/api/password-reset/"
            console.log(accountEmail +' ' + accountUsername)
            const response = await axios.post(URL,{
                 username:accountUsername,
                email: accountEmail
            })

            const result = await response.data;

            if (response.ok && result) {
                // If the search is successful, display the result
                setSuccess(result.message)
            } else {
                // If the search fails, display an error message
                setError(result.message)
            }
        } catch (error) {
            // Handle any network errors
            console.error('Search error:', error.message);
            console.log(error.message)
        }
    };
    return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <h2 className="text-center mb-4">Grab password reset link</h2>

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
                                <label htmlFor="acc_email">Account email:</label>
                                <input
                                    type="acc_email"
                                    className="form-control"
                                    id="acc_email"
                                    value={accountEmail}
                                    onChange={(e) => setAccountEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Send password reset link</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GrabResetLink;
