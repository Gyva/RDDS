import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const DepartmentForm = () => {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        sup_id: ''
    });

    const { register, handleSubmit, formState: { errors } } = useForm();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const onSubmit = (data) => {
        // Handle form submission logic
        console.log('Form submitted:', data);
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Department Information Form</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <label htmlFor="id" className="form-label">ID:</label>
                    <input
                        type="text"
                        id="id"
                        className={`form-control ${errors.id ? 'is-invalid' : ''}`}
                        {...register('id', { required: 'ID is required' })}
                        value={formData.id}
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
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="sup_id" className="form-label">Supervisor ID:</label>
                    <input
                        type="text"
                        id="sup_id"
                        className={`form-control ${errors.sup_id ? 'is-invalid' : ''}`}
                        {...register('sup_id', { required: 'Supervisor ID is required' })}
                        value={formData.sup_id}
                        onChange={handleChange}
                    />
                    {errors.sup_id && <div className="invalid-feedback">{errors.sup_id.message}</div>}
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}

export default DepartmentForm;
