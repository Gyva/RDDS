import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthProvider';

const RegistrarRegistrationForm = () => {
    const [afterSubmitMessage, setAfterSubmitMessage] = useState(null);
    const {auth} = useContext(AuthContext)

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = async (data) => {
        console.log('Form submitted:', data);

        const URL = 'http://127.0.0.1:8000/api/users/create-register-user/';  // Update with your API endpoint
        try {
            const response = await axios.post(URL,{data, user:auth.user}, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log(response.data);
            setAfterSubmitMessage(response.data.message);
            alert(response.data.message);
            reset();  // Reset the form after successful submission
        } catch (error) {
            console.error('Error occurred', error);
        }
    };

    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
            <div className="card w-100 rounded-top-4 rounded-bottom-4" style={{ maxWidth: '800px', height: '70vh', overflowY: 'auto' }}>
                <span className='text-primary ml-5'>{afterSubmitMessage}</span>
                <div className="card-header bg-primary text-white rounded-top-4">
                    <h2 className="m-2 text-center">Register a new registrar to the system</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)} className='form-group' encType="multipart/form-data">

                        <div className="mb-3">
                            <div className="col-12">
                                <label htmlFor="first_name" className="form-label">First Name:</label>
                                <input
                                    type="text"
                                    id="first_name"
                                    className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                                    {...register('first_name', { required: 'First name is required' })}
                                />
                                {errors.first_name && <div className="invalid-feedback">{errors.first_name.message}</div>}
                            </div>
                            <div className="col-12">
                                <label htmlFor="last_name" className="form-label">Last Name:</label>
                                <input
                                    type="text"
                                    id="last_name"
                                    className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                                    {...register('last_name', { required: 'Last name is required' })}
                                />
                                {errors.last_name && <div className="invalid-feedback">{errors.last_name.message}</div>}
                            </div>
                            <div className="col-12">
                                <label htmlFor="email" className="form-label">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: 'Invalid email address'
                                        }
                                    })}
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                            </div>
                            
                        </div>

                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary w-100">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegistrarRegistrationForm;
