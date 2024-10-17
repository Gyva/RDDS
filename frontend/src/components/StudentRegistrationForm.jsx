import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import 'bootstrap/dist/css/bootstrap.min.css';

const StudentRegistrationForm = ({ contextValues }) => {
    const [departments, setDepartments] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [levels, setLevels] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(contextValues?.dpt_id || '');
    const [selectedFaculty, setSelectedFaculty] = useState(contextValues?.f_id || '');
    const [afterSubmitMessage, setAfterSubmitMessage] = useState(null);

    const { register, handleSubmit, formState: { errors }, setValue, getValues, reset } = useForm({
        defaultValues: {
            dpt_id: contextValues?.dpt_id || '',
            f_id: contextValues?.f_id || '',
            l_id: contextValues?.l_id || ''
        }
    });

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/departments/')
            .then(response => response.json())
            .then(data => setDepartments(data))
            .catch(error => console.error('Error fetching departments:', error));
    }, []);

    useEffect(() => {
        if (selectedDepartment) {
            fetch(`http://127.0.0.1:8000/api/faculties/?dpt_id=${selectedDepartment}`)
                .then(response => response.json())
                .then(data => {
                    setFaculties(data);
                    if (contextValues?.f_id && !data.find(faculty => faculty.f_id === contextValues.f_id)) {
                        setValue('f_id', '');
                    }
                })
                .catch(error => console.error('Error fetching faculties:', error));
        } else {
            setFaculties([]);
            setValue('f_id', '');
        }
    }, [selectedDepartment, contextValues?.f_id]);

    useEffect(() => {
        if (selectedFaculty) {
            fetch(`http://127.0.0.1:8000/api/levels/?f_id=${selectedFaculty}`)
                .then(response => response.json())
                .then(data => {
                    setLevels(data);
                    if (contextValues?.l_id && !data.find(level => level.l_id === contextValues.l_id)) {
                        setValue('l_id', '');
                    }
                })
                .catch(error => console.error('Error fetching levels:', error));
        } else {
            setLevels([]);
            setValue('l_id', '');
        }
    }, [selectedFaculty, contextValues?.l_id]);

    const handleDepartmentChange = (e) => {
        const departmentId = e.target.value;
        setSelectedDepartment(departmentId);
        setSelectedFaculty('');
        setLevels([]);
        setValue('f_id', '');
        setValue('l_id', '');
    };

    const handleFacultyChange = (e) => {
        const facultyId = e.target.value;
        setSelectedFaculty(facultyId);
        setLevels([]);
        setValue('l_id', '');
    };

    const onSubmit = (data) => {
        console.log('Form submitted:', data);

        fetch('http://127.0.0.1:8000/api/students/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to submit form');
                }
            })
            .then(data => {
                console.log('Success:', data);
                setAfterSubmitMessage(data.message);
                reset(); // Reset form after successful submission
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <div className="container mt-5">
            {afterSubmitMessage && <span className='text text-primary'>{afterSubmitMessage}</span>}
            <div className='border rounde-top-4 p-3'>
                <div className='bg-success text-white px-3 py-1 rounded-top-4'>
                    <h2 className="text-center">Student Registration Form</h2>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
                    <div className="col-md-6">
                        <label htmlFor="fname" className="form-label">First Name:</label>
                        <input
                            type="text"
                            id="fname"
                            className={`form-control ${errors.fname ? 'is-invalid' : ''}`}
                            {...register('fname', { required: 'First name is required' })}
                        />
                        {errors.fname && <div className="invalid-feedback">{errors.fname.message}</div>}
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="lname" className="form-label">Last Name:</label>
                        <input
                            type="text"
                            id="lname"
                            className={`form-control ${errors.lname ? 'is-invalid' : ''}`}
                            {...register('lname', { required: 'Last name is required' })}
                        />
                        {errors.lname && <div className="invalid-feedback">{errors.lname.message}</div>}
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="dob" className="form-label">Date of Birth:</label>
                        <input
                            type="date"
                            id="dob"
                            className={`form-control ${errors.dob ? 'is-invalid' : ''}`}
                            {...register('dob', { required: 'Date of Birth is required' })}
                        />
                        {errors.dob && <div className="invalid-feedback">{errors.dob.message}</div>}
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="email" className="form-label">Email:</label>
                        <input
                            type="email"
                            id="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            {...register('email', {
                                required: 'Email address is required',
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Invalid email address'
                                }
                            })}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                    </div>

                    <div className="col-md-6">
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

                    <div className="col-md-6">
                        <label htmlFor="dpt_id" className="form-label">Department:</label>
                        <select
                            id="dpt_id"
                            className={`form-control ${errors.dpt_id ? 'is-invalid' : ''}`}
                            {...register('dpt_id', { required: 'Department is required' })}
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
                        {errors.dpt_id && <div className="invalid-feedback">{errors.dpt_id.message}</div>}
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="f_id" className="form-label">Faculty:</label>
                        <select
                            id="f_id"
                            className={`form-control ${errors.f_id ? 'is-invalid' : ''}`}
                            {...register('f_id', { required: 'Faculty is required' })}
                            value={selectedFaculty}
                            onChange={handleFacultyChange}
                        >
                            <option value="">Choose from faculties</option>
                            {faculties.map(faculty => (
                                <option key={faculty.f_id} value={faculty.f_id}>
                                    {faculty.f_name}
                                </option>
                            ))}
                        </select>
                        {errors.f_id && <div className="invalid-feedback">{errors.f_id.message}</div>}
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="l_id" className="form-label">Level:</label>
                        <select
                            id="l_id"
                            className={`form-control ${errors.l_id ? 'is-invalid' : ''}`}
                            {...register('l_id', { required: 'Level is required' })}
                        >
                            <option value="">Choose from levels</option>
                            {levels.map(level => (
                                <option key={level.l_id} value={level.l_id}>
                                    {level.l_name}
                                </option>
                            ))}
                        </select>
                        {errors.l_id && <div className="invalid-feedback">{errors.l_id.message}</div>}
                    </div>

                    <div className="col-12">
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentRegistrationForm;
