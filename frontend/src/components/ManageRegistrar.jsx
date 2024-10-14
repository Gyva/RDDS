import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import DataTable from 'react-data-table-component';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ManageRegistrar = () => {
    const [registrars, setRegistrars] = useState([]);
    const [selectedRegistrar, setSelectedRegistrar] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    useEffect(() => {
        const fetchData = async () => {
            await fetchRegistrars();
        };
        fetchData();
    }, []);

    const fetchRegistrars = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/users/'); // Update with your API endpoint
            console.log('Fetched registrars:', response.data); // Debug log

            // Filter out users with the role "REGISTRAR"
            const filteredRegistrars = response.data.filter(user => user.role !== 'REGISTRAR');
            setRegistrars(filteredRegistrars); // Update state with filtered data
        } catch (error) {
            console.error('Error fetching registrars:', error);
        }
    };

    const handleUpdate = async (data) => {
        console.log('Update data:', data); // Debug log
        try {
            await axios.patch(`http://127.0.0.1:8000/api/users/${selectedRegistrar.id}/`, data); // Update with your API endpoint
            fetchRegistrars(); // Refresh the list after update
            handleCloseModal(); // Close the modal
        } catch (error) {
            console.error('Error updating registrar:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this registrar?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/users/${id}/`); // Update with your API endpoint
                fetchRegistrars(); // Refresh the list after deletion
            } catch (error) {
                console.error('Error deleting registrar:', error);
            }
        }
    };

    const handleOpenModal = (registrar) => {
        console.log('Selected registrar for update:', registrar); // Debug log
        setSelectedRegistrar(registrar);
        reset(registrar); // Pre-fill the form with the selected registrar's data
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRegistrar(null);
        reset(); // Clear form fields when closing the modal
    };

    const columns = [
        { name: 'Reg Number', selector: row => row.username, sortable: true }, // Display regNumber (username) here
        { name: 'First Name', selector: row => row.first_name, sortable: true },
        { name: 'Last Name', selector: row => row.last_name, sortable: true },
        { name: 'Email', selector: row => row.email, sortable: true },
        {
            name: 'Actions',
            cell: row => (
                <div>
                    <button className="btn btn-warning me-2" onClick={() => handleOpenModal(row)}>
                        <i className="fas fa-pencil-alt"></i> {/* Edit Icon */}
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(row.id)}>
                        <i className="fas fa-trash"></i> {/* Trash Icon */}
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="container-fluid">
            <h2 className="my-4 text-center">Manage Registrars</h2>
            <DataTable
                title="Registrars List"
                columns={columns}
                data={registrars}
                pagination
                highlightOnHover
                striped
                persistTableHead
            />

            {/* Update Modal */}
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
                                    {/* <div className="mb-3">
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
                                    </div> */}
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
