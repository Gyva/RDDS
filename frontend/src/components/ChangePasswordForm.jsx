import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from '../contexts/AuthProvider';

const ChangePasswordForm = () => {
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { auth, api } = useContext(AuthContext); // Use the api from AuthProvider

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            old_password: '',
            new_password: '',
            confirm_new_password: ''
        }
    });

    const onSubmit = async (data) => {
        if (data.new_password !== data.confirm_new_password) {
            setErrorMessage('New password and confirmation do not match.');
            return;
        }

        const URL = `http://127.0.0.1:8000/api/change-password/`;

        try {
            // Use api from AuthProvider which has interceptors
            const response = await api.post(URL, {
                old_password: data.old_password,
                new_password: data.new_password,
                user: auth.user
            });
            
            setSuccessMessage('Password changed successfully.');
            setErrorMessage('');
            reset(); // Reset form fields after successful submission
        } catch (error) {
            setErrorMessage('Failed to change password. Please try again.');
            console.error('Error:', error);
        }
    };

    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
            <div className="card w-100 rounded-top-4" style={{ maxWidth: '600px', height: '60vh', overflowY: 'auto' }}>
                <div className="card-header bg-danger text-white rounded-top-4">
                    <h2 className="m-2 text-center">Change Password</h2>
                </div>
                <div className="card-body">
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    
                    <form onSubmit={handleSubmit(onSubmit)} className='form-group'>
                        <div className="mb-3">
                            <label htmlFor="old_password" className="form-label">Old Password:</label>
                            <input
                                type="password"
                                id="old_password"
                                className={`form-control ${errors.old_password ? 'is-invalid' : ''}`}
                                {...register('old_password', { required: 'Old password is required' })}
                            />
                            {errors.old_password && <div className="invalid-feedback">{errors.old_password.message}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="new_password" className="form-label">New Password:</label>
                            <input
                                type="password"
                                id="new_password"
                                className={`form-control ${errors.new_password ? 'is-invalid' : ''}`}
                                {...register('new_password', {
                                    required: 'New password is required',
                                    minLength: {
                                        value: 8,
                                        message: 'Password must be at least 8 characters long'
                                    }
                                })}
                            />
                            {errors.new_password && <div className="invalid-feedback">{errors.new_password.message}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="confirm_new_password" className="form-label">Confirm New Password:</label>
                            <input
                                type="password"
                                id="confirm_new_password"
                                className={`form-control ${errors.confirm_new_password ? 'is-invalid' : ''}`}
                                {...register('confirm_new_password', { required: 'Please confirm your new password' })}
                            />
                            {errors.confirm_new_password && <div className="invalid-feedback">{errors.confirm_new_password.message}</div>}
                        </div>

                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary w-100">Change Password</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordForm;
