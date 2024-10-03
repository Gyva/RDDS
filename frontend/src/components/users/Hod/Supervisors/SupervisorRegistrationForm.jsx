import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const SupervisorRegistrationForm = ({ contextValues }) => {
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(contextValues?.department_id || '');

    const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm({
        defaultValues: {
            department_id: contextValues?.department_id || '',
        }
    });
    const defaultProfilePic = '../../../assets/default_profile.png';

    // Fetch departments on component mount
    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/departments/')
            .then(response => response.json())
            .then(data => setDepartments(data))
            .catch(error => console.error('Error fetching departments:', error));
    }, []);

    // Handle department change
    const handleDepartmentChange = (e) => {
        const departmentId = e.target.value;
        setSelectedDepartment(departmentId);
        setValue('department_id', departmentId);
    };

    // Custom validation to check if the department is valid
    const validateDepartment = () => {
        const department = getValues('department_id');
        if (department && !departments.find(d => d.dpt_id == department)) {
            return 'Selected department is not valid.';
        }
        return true;
    };

    // Handle form submission
    const onSubmit = async (data) => {
        const validationError = validateDepartment();
        if (validationError !== true) {
            alert(validationError);
            return;
        }

        if (!data.profile_pic) {
            data.profile_pic = defaultProfilePic;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/supervisors/', data, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log('Form submitted successfully:', response.data);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
            <div className="card w-100 rounded-top-4 rounded-bottom-4" style={{ maxWidth: '800px', height: '70vh', overflowY: 'auto' }}>
                <div className="card-header bg-success text-white rounded-top-4">
                    <h2 className="m-2 text-center">Register a new supervisor to the system</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)} className="form-group" encType="multipart/form-data">
                        <div className="row mb-3">
                            <div className="col-12 col-md-6">
                                <label htmlFor="fname" className="form-label">First Name:</label>
                                <input
                                    type="text"
                                    id="fname"
                                    className={`form-control ${errors.fname ? 'is-invalid' : ''}`}
                                    {...register('fname', { required: 'First name is required' })}
                                />
                                {errors.fname && <div className="invalid-feedback">{errors.fname.message}</div>}
                            </div>
                            <div className="col-12 col-md-6">
                                <label htmlFor="lname" className="form-label">Last Name:</label>
                                <input
                                    type="text"
                                    id="lname"
                                    className={`form-control ${errors.lname ? 'is-invalid' : ''}`}
                                    {...register('lname', { required: 'Last name is required' })}
                                />
                                {errors.lname && <div className="invalid-feedback">{errors.lname.message}</div>}
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-12 col-md-6">
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
                            <div className="col-12 col-md-6">
                                <label htmlFor="phone" className="form-label">Phone:</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                    {...register('phone', {
                                        required: 'Phone number is required',
                                        pattern: {
                                            value: /^(078|073|072)\d{7}$/,
                                            message: 'Phone number must start with 078, 073, or 072 and be 10 digits long'
                                        }
                                    })}
                                />
                                {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-12 col-md-6">
                                <label htmlFor="profile_pic" className="form-label">Profile Picture URL:</label>
                                <input
                                    type="file"
                                    id="profile_pic"
                                    className="form-control"
                                    {...register('profile_pic')}
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <label htmlFor="specialization" className="form-label">Specialization:</label>
                                <input
                                    type="text"
                                    id="specialization"
                                    className={`form-control ${errors.specialization ? 'is-invalid' : ''}`}
                                    {...register('specialization', { required: 'Specialization is required' })}
                                />
                                {errors.specialization && <div className="invalid-feedback">{errors.specialization.message}</div>}
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-12 col-md-6">
                                <label htmlFor="department_id" className="form-label">Department:</label>
                                <select
                                    id="department_id"
                                    className={`form-control ${errors.department_id ? 'is-invalid' : ''}`}
                                    {...register('department_id', { required: 'Department is required' })}
                                    value={selectedDepartment}
                                    onChange={handleDepartmentChange}
                                >
                                    <option value="">Choose from departments</option>
                                    {departments.map(department => (
                                        <option key={department.dpt_id} value={department.dpt_id}>
                                            {department.dpt_name}
                                        </option>
                                    ))}
                                </select>
                                {errors.department_id && <div className="invalid-feedback">{errors.department_id.message}</div>}
                            </div>
                            <div className="col-12 col-md-6">
                                <label htmlFor="roles" className="form-label">Roles:</label>
                                <select
                                    id="roles"
                                    className={`form-control ${errors.role ? 'is-invalid' : ''}`}
                                    {...register('role', { required: 'Role is required' })}
                                >
                                    <option value="">Choose role</option>
                                    <option value="HoD">HoD</option>
                                    <option value="Lecturer">Lecturer</option>
                                </select>
                                {errors.role && <div className="invalid-feedback">{errors.role.message}</div>}
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

export default SupervisorRegistrationForm;
