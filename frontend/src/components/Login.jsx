import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = (data) => {
        // Simulate login process and authentication
        if (data.email === 'test@example.com' && data.password === 'password') {
            onLogin(); // Set authentication status to true
            navigate('/register'); // Redirect to the protected route
        } else {
            alert('Invalid credentials');
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <h2 className="text-center mb-4">Login</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column">
                            <div className="form-group mb-3">
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="text"
                                    id="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    {...register('email', {
                                        required: 'Email address is required',
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: 'Invalid email address'
                                        }
                                    })}
                                    placeholder="Enter your email"
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="password">Password:</label>
                                <input
                                    type="password"
                                    id="password"
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    {...register('password', { required: 'Password is required' })}
                                    placeholder="Enter your password"
                                />
                                {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Login</button>
                        </form>
                        <div className='d-flex justify-content-end'>
                            <Link to={"/claim_password"} className='text-decoration-none text-primary'>Create account</Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
