import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import DataTable from 'react-data-table-component';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AuthContext } from '../contexts/AuthProvider';

const ManageRegistrar = () => {
    const [registrars, setRegistrars] = useState([]);
    const [selectedRegistrar, setSelectedRegistrar] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showRegistrationForm, setShowRegistrationForm] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const { auth, api } = useContext(AuthContext);
    const [afterSubmitMessage, setAfterSubmitMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    const user = auth.user;

    useEffect(() => {
        const fetchData = async () => {
            await fetchRegistrars();
        };
        fetchData();
    }, []);

    const fetchRegistrars = async () => {
        try {
            const response = await api.get('http://127.0.0.1:8000/api/users/');
            const filteredRegistrars = response.data.filter(user => user.role === 'REGISTER');
            setRegistrars(filteredRegistrars);
        } catch (error) {
            setErrorMessage('Error fetching registrars.');
        }
    };

    const handleUpdate = async (data) => {
        try {
            await api.patch(`http://127.0.0.1:8000/api/users/${selectedRegistrar.id}/`, data);
            fetchRegistrars();
            setSuccessMessage('Registrar updated successfully.');
            handleCloseModal();
        } catch (error) {
            setErrorMessage('Error updating registrar.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this registrar?")) {
            try {
                await api.delete(`http://127.0.0.1:8000/api/users/${id}/`);
                fetchRegistrars();
                setSuccessMessage('Registrar deleted successfully.');
            } catch (error) {
                setErrorMessage('Error deleting registrar.');
            }
        }
    };

    const handleRegisterSubmit = async (data) => {
        const URL = 'http://127.0.0.1:8000/api/users/create-register-user/';
        try {
            const response = await api.post(URL, { ...data, user: auth.user }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            setAfterSubmitMessage(response.data.message);
            setSuccessMessage('Registrar created successfully.');
            reset();
            fetchRegistrars();
        } catch (error) {
            setErrorMessage('Error occurred while creating registrar.');
        }
    };

    const handleOpenModal = (registrar) => {
        setSelectedRegistrar(registrar);
        reset(registrar);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRegistrar(null);
        reset();
    };

    const columns = [
        { name: 'Reg Number', selector: row => row.username, sortable: true },
        { name: 'First Name', selector: row => row.first_name, sortable: true },
        { name: 'Last Name', selector: row => row.last_name, sortable: true },
        { name: 'Email', selector: row => row.email, sortable: true },
        {
            name: 'Actions',
            cell: row => (
                <div className='d-flex'>
                    <button className="btn btn-warning me-2" onClick={() => handleOpenModal(row)}>
                        <i className="fas fa-pencil-alt"></i>
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(row.id)}>
                        <i className="fas fa-trash"></i>
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="container-fluid">
            <h2 className="my-4 text-center">Manage Registrars</h2>

            {/* Display success and error messages */}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <div className="d-flex justify-content-between mb-4">
                <h4>{showRegistrationForm ? 'Register a new Registrar' : 'Registrars List'}</h4>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowRegistrationForm(!showRegistrationForm)}
                >
                    {showRegistrationForm ? 'View Registrar List' : 'Add Registrar'}
                </button>
            </div>

            {showRegistrationForm ? (
                <div className="card w-100 rounded-top-4 rounded-bottom-4" style={{ maxWidth: '800px' }}>
                    <span className='text-primary ml-5'>{afterSubmitMessage}</span>
                    <div className="card-header bg-primary text-white rounded-top-4">
                        <h2 className="m-2 text-center">Register a new registrar to the system</h2>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit(handleRegisterSubmit)} className='form-group' encType="multipart/form-data">
                            <div className="mb-3">
                                <label htmlFor="first_name" className="form-label">First Name:</label>
                                <input
                                    type="text"
                                    id="first_name"
                                    className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                                    {...register('first_name', { required: 'First name is required' })}
                                />
                                {errors.first_name && <div className="invalid-feedback">{errors.first_name.message}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="last_name" className="form-label">Last Name:</label>
                                <input
                                    type="text"
                                    id="last_name"
                                    className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                                    {...register('last_name', { required: 'Last name is required' })}
                                />
                                {errors.last_name && <div className="invalid-feedback">{errors.last_name.message}</div>}
                            </div>
                            <div className="mb-3">
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
                            <div className="d-flex justify-content-center">
                                <button type="submit" className="btn btn-primary w-100">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <DataTable
                    
                    columns={columns}
                    data={registrars}
                    pagination
                    highlightOnHover
                    striped
                    persistTableHead
                />
            )}

            {showModal && (
                <div className="modal show" style={{ display: 'block', marginTop: '28px' }} onClick={handleCloseModal}>
                    <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Update Registrar</h5>
                                <button type="button" className="close" onClick={handleCloseModal}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit(handleUpdate)}>
                                    <div className="mb-3">
                                        <label htmlFor="first_name" className="form-label">First Name:</label>
                                        <input
                                            type="text"
                                            id="first_name"
                                            className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                                            {...register('first_name', { required: 'First name is required' })}
                                        />
                                        {errors.first_name && <div className="invalid-feedback">{errors.first_name.message}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="last_name" className="form-label">Last Name:</label>
                                        <input
                                            type="text"
                                            id="last_name"
                                            className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                                            {...register('last_name', { required: 'Last name is required' })}
                                        />
                                        {errors.last_name && <div className="invalid-feedback">{errors.last_name.message}</div>}
                                    </div>
                                    <div className="mb-3">
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
                                    <button type="submit" className="btn btn-primary w-100">Update</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageRegistrar;
