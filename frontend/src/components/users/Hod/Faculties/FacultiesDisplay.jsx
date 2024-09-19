import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Display.css';

const FacultiesDisplay = () => {
    const [faculties, setFaculties] = useState([]);
    const [levels, setLevels] = useState({});
    const [departments, setDepartments] = useState({});
    const [editing, setEditing] = useState(false);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [newFacultyName, setNewFacultyName] = useState('');
    const [newLevelName, setNewLevelName] = useState('');
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showAddLevelModal, setShowAddLevelModal] = useState(false);
    const [successAlerts, setSuccessAlerts] = useState(null);
    const [errorAlerts, setErrorAlerts] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(5); // Number of rows per page

    // Fetch all faculties on component mount
    useEffect(() => {
        fetchFaculties();
        fetchDepartments();
    }, []);

    const fetchFaculties = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/faculties/');
            setFaculties(response.data);
            // Fetch levels for each faculty
            response.data.forEach(faculty => {
                fetchLevels(faculty.f_id);
            });
        } catch (error) {
            console.error('Error fetching faculties:', error);
            setErrorAlerts('Failed to fetch faculties');
        }
    };

    const fetchLevels = async (f_id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/levels/?f_id=${f_id}`);
            if (response && response.data) {
                setLevels(prev => ({
                    ...prev,
                    [f_id]: response.data
                }));
            }
        } catch (error) {
            console.error('Error fetching levels:', error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/departments/');
            const departmentsMap = response.data.reduce((acc, dept) => {
                acc[dept.dpt_id] = dept.dpt_name;
                return acc;
            }, {});
            setDepartments(departmentsMap);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const deleteThisFaculty = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this faculty?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/faculties/${id}/`);
                setSuccessAlerts('Faculty deleted successfully');
                fetchFaculties();
            } catch (error) {
                console.error('Error deleting faculty:', error);
                setErrorAlerts('Failed to delete faculty');
            }
        }
    };

    const handleUpdateFaculty = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/faculties/${selectedFaculty.f_id}/`, {
                f_name: newFacultyName
            });
            setSuccessAlerts('Faculty updated successfully');
            setShowUpdateModal(false);
            fetchFaculties();
        } catch (error) {
            console.error('Error updating faculty:', error);
            setErrorAlerts('Failed to update? Try again');
        }
    };

    const handleAddLevel = async (f_id,dpt_id) => {
        try {
            await axios.post(`http://127.0.0.1:8000/api/levels/`, {
                l_name: newLevelName,
                f_id,
                dpt_id
            });
            setSuccessAlerts('Level added successfully');
            setShowAddLevelModal(false);
            fetchFaculties();
        } catch (error) {
            console.error('Error adding level:', error);
            setErrorAlerts('Level was not successfully added');
        }
    };

    // Pagination logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentFaculties = faculties.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(faculties.length / rowsPerPage);

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
            <h2 className="mb-3 text-center">Faculties Information</h2>
            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead style={{ backgroundColor: '#007bff', color: 'white' }}>
                        <tr>
                            <th>#</th>
                            <th>Faculty</th>
                            <th>Department</th>
                            <th>N<sup>o</sup> of Levels</th>
                            <th colSpan={3}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentFaculties.map((faculty, index) => (
                            <tr key={faculty.f_id}>
                                <td>{indexOfFirstRow + index + 1}</td>
                                <td>{faculty.f_name}</td>
                                <td>{departments[faculty.dpt_id] || 'Loading...'}</td>
                                <td>{levels[faculty.f_id] ? levels[faculty.f_id].length : 0}</td> {/* Fix here */}
                                <td>
                                    <button
                                        onClick={() => {
                                            setSelectedFaculty(faculty);
                                            setNewFacultyName(faculty.f_name);
                                            setShowUpdateModal(true);
                                        }}
                                        className='btn btn-warning'
                                    >
                                        <i className="fas fa-pencil-alt"></i> Update
                                    </button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => deleteThisFaculty(faculty.f_id)}
                                        className='btn btn-danger'
                                    >
                                        <i className="fas fa-trash"></i> Delete
                                    </button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => {
                                            setSelectedFaculty(faculty);
                                            setShowAddLevelModal(true);
                                        }}
                                        className='btn btn-success'
                                    >
                                        <i className="fas fa-plus"></i> Add a Level
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

            {/* Update Faculty Modal */}
            {showUpdateModal && (
                <div className="modal show d-block custom-modal-position" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Updating the Faculty Name</h5>
                                <button type="button" className="btn-close" onClick={() => setShowUpdateModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newFacultyName}
                                    onChange={(e) => setNewFacultyName(e.target.value)}
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleUpdateFaculty}>Update</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Level Modal */}
            {showAddLevelModal && (
                <div className="modal show d-block custom-modal-position" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Adding a New Level to Faculty</h5>
                                <button type="button" className="btn-close" onClick={() => setShowAddLevelModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Level Name"
                                    value={newLevelName}
                                    onChange={(e) => setNewLevelName(e.target.value)}
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowAddLevelModal(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={() => handleAddLevel(selectedFaculty.f_id,selectedFaculty.dpt_id)}>Add Level</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacultiesDisplay;
