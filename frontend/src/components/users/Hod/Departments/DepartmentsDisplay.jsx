import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Display.css';

const DepartmentsDisplay = () => {
    const [departments, setDepartments] = useState([]);
    const [editing, setEditing] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [newDepartmentName, setNewDepartmentName] = useState('');
    const [newFacultyName, setNewFacultyName] = useState('');
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showAddFacultyModal, setShowAddFacultyModal] = useState(false);
    const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false); // State for Add Department Modal
    const [successAlerts, setSuccessAlerts] = useState(null);
    const [errorAlerts, setErrorAlerts] = useState(null);
    const [facultiesCount, setFacultiesCount] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(5); // Number of rows per page

    const navigate = useNavigate();

    // Fetch all departments on component mount
    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/departments/');
            setDepartments(response.data);
            response.data.forEach(department => {
                fetchFacultiesCount(department.dpt_id);
            });
        } catch (error) {
            console.error('Error fetching departments:', error);
            setErrorAlerts('Failed to fetch departments');
        }
    };

    const fetchFacultiesCount = async (dpt_id) => {
        try {
            const URL = `http://127.0.0.1:8000/api/faculties/?dpt_id=${dpt_id}`;
            const response = await axios.get(URL);
            if (response && response.data) {
                setFacultiesCount(prev => ({
                    ...prev,
                    [dpt_id]: response.data.length
                }));
            }
        } catch (error) {
            console.error('Error fetching faculties:', error);
        }
    };

    const deleteThisDepartment = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this department?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/departments/${id}/`);
                setSuccessAlerts('Department deleted successfully');
                fetchDepartments();
            } catch (error) {
                console.error('Error deleting department:', error);
                setErrorAlerts('Failed to delete department');
            }
        }
    };

    const handleUpdateDepartment = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/departments/${selectedDepartment.dpt_id}/`, {
                dpt_name: newDepartmentName
            });
            setSuccessAlerts('Department updated successfully');
            setShowUpdateModal(false);
            fetchDepartments();
        } catch (error) {
            console.error('Error updating department:', error);
            setErrorAlerts('Failed to update? Try again');
        }
    };

    const handleAddFaculty = async (dpt_id) => {
        try {
            await axios.post(`http://127.0.0.1:8000/api/faculties/`, {
                f_name: newFacultyName,
                dpt_id
            });
            setSuccessAlerts('Faculty added successfully');
            setShowAddFacultyModal(false);
            fetchDepartments();
        } catch (error) {
            console.error('Error adding faculty:', error);
            setErrorAlerts('Faculty was not successfully added');
        }
    };

    const handleAddDepartment = async () => {
        try {
            await axios.post(`http://127.0.0.1:8000/api/departments/`, {
                dpt_name: newDepartmentName
            });
            setSuccessAlerts('Department added successfully');
            setShowAddDepartmentModal(false);
            fetchDepartments();
        } catch (error) {
            console.error('Error adding department:', error);
            setErrorAlerts('Failed to add department');
        }
    };

    // Pagination logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentDepartments = departments.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(departments.length / rowsPerPage);

    const handleNextPage = () => {
        setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
    };

    const handlePreviousPage = () => {
        setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));
    };

    return (
        <div className="container mt-5">
            {successAlerts && (<span className='flex justify-content-end text-success'>{successAlerts}</span>)}
            {errorAlerts && (<span className='flex justify-content-end text-danger'>{errorAlerts}</span>)}
            
            {/* Button to open Add Department Modal */}
            <button 
                className="btn btn-success mb-3 float-end"
                onClick={() => setShowAddDepartmentModal(true)}
            >
                <i className="fas fa-plus"></i> Add Department
            </button>
            
            <h2 className="mb-3 text-center">Departments Information</h2>
            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead style={{ backgroundColor: '#007bff', color: 'white' }}>
                        <tr>
                            <th>#</th>
                            <th>Departments</th>
                            <th onClick={()=>{navigate('/faculties')}}>N<sup>o</sup> of <span>Faculties</span></th>
                            <th colSpan={3}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentDepartments.map((dpt, index) => (
                            <tr key={dpt.dpt_id}>
                                <td>{indexOfFirstRow + index + 1}</td>
                                <td>{dpt.dpt_name}</td>
                                <td>{facultiesCount[dpt.dpt_id] || '0'}</td>
                                <td>
                                    <button
                                        onClick={() => {
                                            setSelectedDepartment(dpt);
                                            setNewDepartmentName(dpt.dpt_name);
                                            setShowUpdateModal(true);
                                        }}
                                        className='btn btn-warning'
                                    >
                                        <i className="fas fa-pencil-alt"></i>
                                    </button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => deleteThisDepartment(dpt.dpt_id)}
                                        className='btn btn-danger'
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => {
                                            setSelectedDepartment(dpt);
                                            setShowAddFacultyModal(true);
                                        }}
                                        className='btn btn-success'
                                    >
                                        <i className="fas fa-plus"></i> Add a faculty
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-between align-items-center mt-3">
                <button
                    className="btn btn-secondary"
                    disabled={currentPage === 1}
                    onClick={handlePreviousPage}
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    className="btn btn-secondary"
                    disabled={currentPage === totalPages}
                    onClick={handleNextPage}
                >
                    Next
                </button>
            </div>

            {/* Update Department Modal */}
            {showUpdateModal && (
                <div className="modal show d-block custom-modal-position" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Updating the Department Name</h5>
                                <button type="button" className="btn-close" onClick={() => setShowUpdateModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newDepartmentName}
                                    onChange={(e) => setNewDepartmentName(e.target.value)}
                                />
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowUpdateModal(false)}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleUpdateDepartment}
                                >
                                    Save changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Faculty Modal */}
            {showAddFacultyModal && (
                <div className="modal show d-block custom-modal-position" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add New Faculty</h5>
                                <button type="button" className="btn-close" onClick={() => setShowAddFacultyModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newFacultyName}
                                    placeholder='Faculty Name'
                                    onChange={(e) => setNewFacultyName(e.target.value)}
                                />
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowAddFacultyModal(false)}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => handleAddFaculty(selectedDepartment.dpt_id)}
                                >
                                    Add Faculty
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Department Modal */}
            {showAddDepartmentModal && (
                <div className="modal show d-block custom-modal-position" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add New Department</h5>
                                <button type="button" className="btn-close" onClick={() => setShowAddDepartmentModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newDepartmentName}
                                    placeholder='Department Name'
                                    onChange={(e) => setNewDepartmentName(e.target.value)}
                                />
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowAddDepartmentModal(false)}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleAddDepartment}
                                >
                                    Add Department
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentsDisplay;
