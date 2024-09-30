import React from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import axios from 'axios'

const SetPassword = () => {
    const { register, handleSubmit, formState: { errors }, watch, setError } = useForm();
    const password = watch('password', ''); // Get the value of the password field
    const navigate = useNavigate();
    const location = useLocation(); // Get passed data
    const { reg_no, fname, lname, email, isStudent } = location.state || {}; // Destructure the received data, including role

    const onSubmit = async (data) => {
        try {
            const endpoint = location.state?.st_id
                ? 'http://127.0.0.1:8000/api/students/create-account-student/'
                : 'http://127.0.0.1:8000/api/supervisors/create-account-supervisor/';
        
            const response = await axios.post(
                endpoint,
                {
                    reg_num: reg_no,
                    password: data.password,
                    confirm_password: data.confirmPassword,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                }
            );
        
            if (response.status === 201) {
                alert("Account created successfully!");
                navigate('/'); // Redirect after successful creation
            } else {
                // Handle API errors and display them
                const errorMessage = response.data.error || 'An unknown error occurred.';
                setError('server', { type: 'server', message: errorMessage });
            }
        } catch (error) {
            if (error.response && error.response.data.error) {
                setError('server', { type: 'server', message: error.response.data.error });
            } else {
                setError('server', { type: 'server', message: error.message });
            }
        }
    }    

    return (
        
        <div className="d-flex align-items-center justify-content-center vh-100">
           {/* { console.log(location.state)} */}
            <div className="container">
                <button onClick={() => navigate(-1)}>{`<`}Back</button>
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <h2 className="text-center mb-4">Set your password</h2>
                        {/* Form for setting password */}
                        <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column">
                            {/* Reg_no Field */}
                            <div className="form-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="reg_no"
                                    value={reg_no}
                                    readOnly
                                />
                            </div>

                            {/* Email Field */}
                            <div className="form-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="email"
                                    value={email}
                                    readOnly
                                />
                            </div>

                            {/* Password Field */}
                            <div className="form-group mb-3">
                                <input
                                    type="password"
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    name="password"
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Password must be at least 6 characters long'
                                        }
                                    })}
                                    placeholder="Enter Password"
                                />
                                {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                            </div>

                            {/* Confirm Password Field */}
                            <div className="form-group mb-3">
                                <input
                                    type="password"
                                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                    name="confirmPassword"
                                    {...register('confirmPassword', {
                                        required: 'Please confirm your password',
                                        validate: value =>
                                            value === password || 'Passwords do not match'
                                    })}
                                    placeholder="Confirm Password"
                                />
                                {errors.confirmPassword && (
                                    <div className="invalid-feedback">{errors.confirmPassword.message}</div>
                                )}
                            </div>

                            {/* Display server errors */}
                            {errors.server && <div className="alert alert-danger">{errors.server.message}</div>}

                            {/* Submit Button */}
                            <button type="submit" className="btn btn-primary w-100">Register</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default SetPassword;
