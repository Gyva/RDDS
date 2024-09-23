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
    const [newFacultyId, setNewFacultyId] = useState('');
    const [newDepartmentId, setNewDepartmentId] = useState('');
    const [filteredFaculties, setFilteredFaculties] = useState([]); // Holds faculties filtered by department
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [successAlerts, setSuccessAlerts] = useState(null);
    const [errorAlerts, setErrorAlerts] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(5);

    const navigate = useNavigate();

    // Fetch all faculties and departments on component mount
    useEffect(() => {
        fetchFaculties();
        fetchDepartments();
    }, []);

    // Fetch faculties from the API
    const fetchFaculties = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/faculties/');
            setFaculties(response.data);
        } catch (error) {
            console.error('Error fetching faculties:', error);
            setSuccessAlerts('')
            setErrorAlerts('Failed to fetch faculties');
        }
    };

    // Fetch levels by faculty ID
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

    // Fetch all departments
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

    // Fetch levels whenever faculties are loaded
    useEffect(() => {
        if (faculties.length > 0) {
            faculties.forEach(faculty => fetchLevels(faculty.f_id));
        }
    }, [faculties]);

    // Update level data via API
    const handleUpdateLevel = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/levels/${selectedLevel.l_id}/`, {
                l_name: newLevelName,
                f_id: newFacultyId,
                dpt_id: newDepartmentId
            });
            setErrorAlerts('');
            setSuccessAlerts('Level updated successfully');
            setShowUpdateModal(false);
            fetchFaculties(); // Reload faculties to get updated levels
        } catch (error) {
            console.error('Error updating level:', error);
            setSuccessAlerts('');
            setErrorAlerts('Failed to update the level');
        }
    };

    // Delete level by ID
    const deleteThisLevel = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this level?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/levels/${id}/`);
                setErrorAlerts('');
                setSuccessAlerts('Level deleted successfully');
                fetchFaculties(); // Reload faculties to get updated levels
            } catch (error) {
                console.error('Error deleting level:', error);
                setSuccessAlerts('');
                setErrorAlerts('Failed to delete level');
            }
        }
    };

    // Open modal and populate fields
    const openUpdateModal = (level) => {
        setSelectedLevel(level);
        setNewLevelName(level.l_name);
        setNewDepartmentId(level.dpt_id);
        setNewFacultyId(level.f_id); // Pre-populate the faculty
        filterFacultiesByDepartment(level.dpt_id); // Filter faculties based on department
        setShowUpdateModal(true);
    };

    // Handle department change and update corresponding faculties
    const handleDepartmentChange = (e) => {
        const selectedDepartmentId = e.target.value;
        setNewDepartmentId(selectedDepartmentId);
        filterFacultiesByDepartment(selectedDepartmentId); // Filter faculties based on department selection
        setNewFacultyId(''); // Reset faculty when department changes
    };

    // Filter faculties by the selected department
    const filterFacultiesByDepartment = (departmentId) => {
        const filtered = faculties.filter(faculty => faculty.dpt_id === parseInt(departmentId));
        setFilteredFaculties(filtered);
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
                                        onClick={() => openUpdateModal(level)}
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
                                <label htmlFor="levelName">Level Name</label>
                                <input
                                    id="levelName"
                                    type="text"
                                    className="form-control mb-3"
                                    value={newLevelName}
                                    onChange={(e) => setNewLevelName(e.target.value)}
                                />

                                <label htmlFor="departmentSelect">Department</label>
                                <select
                                    id="departmentSelect"
                                    className="form-control mb-3"
                                    value={newDepartmentId}
                                    onChange={handleDepartmentChange}
                                >
                                    <option value="">Select Department</option>
                                    {Object.entries(departments).map(([id, name]) => (
                                        <option key={id} value={id}>{name}</option>
                                    ))}
                                </select>

                                <label htmlFor="facultySelect">Faculty</label>
                                <select
                                    id="facultySelect"
                                    className="form-control mb-3"
                                    value={newFacultyId}
                                    onChange={(e) => setNewFacultyId(e.target.value)}
                                    disabled={!newDepartmentId}
                                >
                                    <option value="">Select Faculty</option>
                                    {filteredFaculties.map(faculty => (
                                        <option key={faculty.f_id} value={faculty.f_id}>{faculty.f_name}</option>
                                    ))}
                                </select>
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
                                    onClick={handleUpdateLevel}
                                >
                                    Save changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LevelsDisplay;
