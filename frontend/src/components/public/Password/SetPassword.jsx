import React from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const SetPassword = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const password = watch('password', ''); // Get the value of the password field

    const location = useLocation(); // Get passed data
    const { reg_no, fname, lname, email } = location.state || {}; // Destructure the received data

    const onSubmit = (data) => {
        // Handle form submission logic
        console.log('Form submitted:', data);
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <h2 className="text-center mb-4">Set your password</h2>
                        {/* Display the passed data */}
                        <p><strong>Registration No:</strong> {reg_no}</p>
                        <p><strong>First Name:</strong> {fname}</p>
                        <p><strong>Last Name:</strong> {lname}</p>
                        <p><strong>Email:</strong> {email}</p>
                        <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column">
                            {/* Email/Username Field */}
                            <div className="form-group mb-3">
                                <input
                                    type="text"
                                    className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                    name="username"
                                    {...register('username', {
                                        required: 'Email/Username is required',
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email validation
                                            message: 'Invalid email format'
                                        }
                                    })}
                                    placeholder="Enter Email/Username"
                                />
                                {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
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

                            {/* Submit Button */}
                            <button type="submit" className="btn btn-primary w-100">Register</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SetPassword;
