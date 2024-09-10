import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import 'bootstrap/dist/css/bootstrap.min.css';

const LevelRegistrationForm = ({ contextValues }) => {
    const [faculties, setFaculties] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState(contextValues?.faculty_id || '');
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(contextValues?.department_id || '');

    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: {
            id: contextValues?.id || '',
            name: contextValues?.name || '',
            faculty_id: contextValues?.faculty_id || '',
            department_id: contextValues?.department_id || ''
        }
    });

    // Fetch departments on component mount
    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/departments/')
            .then(response => response.json())
            .then(data => setDepartments(data))
            .catch(error => console.error('Error fetching departments:', error));
    }, []);

    // Fetch faculties based on selected department
    useEffect(() => {
        if (selectedDepartment) {
            fetch(`http://127.0.0.1:8000/api/faculties/?dpt_id=${selectedDepartment}`)
                .then(response => response.json())
                .then(data => {
                    setFaculties(data);
                    if (contextValues?.faculty_id && !data.find(faculty => faculty.f_id === contextValues.faculty_id)) {
                        setValue('faculty_id', '');
                    }
                })
                .catch(error => console.error('Error fetching faculties:', error));
        } else {
            setFaculties([]);
            setValue('faculty_id', ''); // Reset faculty field if no department selected
        }
    }, [selectedDepartment, contextValues?.faculty_id]);

    const handleDepartmentChange = (e) => {
        const departmentId = e.target.value;
        setSelectedDepartment(departmentId);
        setSelectedFaculty('');
        setValue('faculty_id', '');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValue(name, value);
    };

    const onSubmit = (data) => {
        console.log('Form submitted:', data);

        fetch('http://127.0.0.1:8000/api/levels/', {
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
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Level Information Form</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <label htmlFor="id" className="form-label">ID:</label>
                    <input
                        type="text"
                        id="id"
                        className={`form-control ${errors.id ? 'is-invalid' : ''}`}
                        {...register('id', { required: 'ID is required' })}
                        onChange={handleChange}
                    />
                    {errors.id && <div className="invalid-feedback">{errors.id.message}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name:</label>
                    <input
                        type="text"
                        id="name"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        {...register('name', { required: 'Name is required' })}
                        onChange={handleChange}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                </div>

                <div className="mb-3">
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

                <div className="mb-3">
                    <label htmlFor="faculty_id" className="form-label">Faculty ID:</label>
                    <select
                        id="faculty_id"
                        className={`form-control ${errors.faculty_id ? 'is-invalid' : ''}`}
                        {...register('faculty_id', { required: 'Faculty ID is required' })}
                        value={selectedFaculty}
                        onChange={handleChange}
                    >
                        <option value="">Choose from faculties</option>
                        {faculties.map(faculty => (
                            <option key={faculty.f_id} value={faculty.f_id}>
                                {faculty.f_name}
                            </option>
                        ))}
                    </select>
                    {errors.faculty_id && <div className="invalid-feedback">{errors.faculty_id.message}</div>}
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default LevelRegistrationForm;
