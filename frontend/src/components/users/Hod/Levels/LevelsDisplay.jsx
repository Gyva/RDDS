import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Display.css';

const LevelsDisplay = () => {
    const [faculties, setFaculties] = useState([]);
    const [levels, setLevels] = useState({});
    const [departments, setDepartments] = useState({});
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [newLevelName, setNewLevelName] = useState('');
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [successAlerts, setSuccessAlerts] = useState(null);
    const [errorAlerts, setErrorAlerts] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(5); // Number of rows per page

    const navigate = useNavigate();

    // Fetch all faculties, levels, and departments on component mount
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

    const handleUpdateLevel = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/levels/${selectedLevel.l_id}/`, {
                l_name: newLevelName
            });
            setSuccessAlerts('Level updated successfully');
            setShowUpdateModal(false);
            fetchFaculties(); // Reload faculties to get updated levels
        } catch (error) {
            console.error('Error updating level:', error);
            setErrorAlerts('Failed to update the level');
        }
    };

    const deleteThisLevel = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this level?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/levels/${id}/`);
                setSuccessAlerts('Level deleted successfully');
                fetchFaculties(); // Reload faculties to get updated levels
            } catch (error) {
                console.error('Error deleting level:', error);
                setErrorAlerts('Failed to delete level');
            }
        }
    };

    // Pagination logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentLevels = Object.values(levels).flat().slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(Object.values(levels).flat().length / rowsPerPage);

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
            <h2 className="mb-3 text-center">Levels Information</h2>
            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead style={{ backgroundColor: '#007bff', color: 'white' }}>
                        <tr>
                            <th>#</th>
                            <th>Level Name</th>
                            <th>Faculty</th>
                            <th>Department</th>
                            <th colSpan={2}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentLevels.map((level, index) => (
                            <tr key={level.l_id}>
                                <td>{indexOfFirstRow + index + 1}</td>
                                <td>{level.l_name}</td>
                                <td>{faculties.find(f => f.f_id === parseInt(level.f_id))?.f_name || 'Loading...'}</td>
                                <td>{departments[faculties.find(f => f.f_id === parseInt(level.f_id))?.dpt_id] || 'Loading...'}</td>
                                <td>
                                    <button
                                        onClick={() => {
                                            setSelectedLevel(level);
                                            setNewLevelName(level.l_name);
                                            setShowUpdateModal(true);
                                        }}
                                        className='btn btn-warning'
                                    >
                                        <i className="fas fa-pencil-alt"></i> Update
                                    </button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => deleteThisLevel(level.l_id)}
                                        className='btn btn-danger'
                                    >
                                        <i className="fas fa-trash"></i> Delete
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

            {/* Update Level Modal */}
            {showUpdateModal && (
                <div className="modal show d-block custom-modal-position" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Updating the Level Name</h5>
                                <button type="button" className="btn-close" onClick={() => setShowUpdateModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newLevelName}
                                    onChange={(e) => setNewLevelName(e.target.value)}
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleUpdateLevel}>Update</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LevelsDisplay;
