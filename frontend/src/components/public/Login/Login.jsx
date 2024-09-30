import React, { useState,useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useContext(AuthContext); // Get login function from context
    const [errMsg, setErrMsg] = useState(null);

    const onSubmit = async (data) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: data.email, // Assuming email field holds the username/regno
                    password: data.password,
                }),
            });
            const result = await response.json();
            console.log(result)
            if (response.ok) {
                login(result.id, result.role); // Call the context login function
                setErrMsg('You are logged')
            } else {
                setErrMsg(result?.non_field_errors ? result?.non_field_errors : 'Failed to login')

            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login');
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <h2 className="text-center mb-4">Login</h2>
                        {errMsg ? <p className='alert alert-danger'>{errMsg}</p> : ''}
                        <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column">
                            <div className="form-group mb-3">
                                <label htmlFor="email">Email/RegNo:</label>
                                <input
                                    type="text"
                                    id="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    {...register('email', {
                                        required: 'Email address or RegNumber is required',
                                    })}
                                    placeholder="Enter your email/RegNo"
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
