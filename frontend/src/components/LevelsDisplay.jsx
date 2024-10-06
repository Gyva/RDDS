import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './LevelsDisplay.css';

const LevelsDisplay = () => {
    const [faculties, setFaculties] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [levels, setLevels] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [newLevelName, setNewLevelName] = useState('');
    const [newFacultyId, setNewFacultyId] = useState('');
    const [newDepartmentId, setNewDepartmentId] = useState('');
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [successAlerts, setSuccessAlerts] = useState(null);
    const [errorAlerts, setErrorAlerts] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchFaculties();
        fetchDepartments();
    }, []);

    const fetchFaculties = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/faculties/');
            setFaculties(response.data);
        } catch (error) {
            setErrorAlerts('Failed to fetch faculties');
        }
    };

    const fetchLevels = async (f_id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/levels/?f_id=${f_id}`);
            if (response && response.data) {
                setLevels((prev) => [...prev, ...response.data]);
            }
        } catch (error) {
            console.error('Error fetching levels:', error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/departments/');
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    useEffect(() => {
        faculties.forEach((faculty) => fetchLevels(faculty.f_id));
    }, [faculties]);

    const handleUpdateLevel = async () => {
        if (!newDepartmentId) {
            setErrorAlerts('Please select a department.');
            return;
        }

        try {
            await axios.put(`http://127.0.0.1:8000/api/levels/${selectedLevel.l_id}/`, {
                l_name: newLevelName,
                f_id: newFacultyId,
                dpt_id: newDepartmentId,
            });
            setSuccessAlerts('Level updated successfully');
            setShowUpdateModal(false);
            fetchFaculties();
        } catch (error) {
            setErrorAlerts('Failed to update the level');
        }
    };

    const deleteThisLevel = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this level?');
        if (confirmDelete) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/levels/${id}/`);
                setSuccessAlerts('Level deleted successfully');
                fetchFaculties();
            } catch (error) {
                setErrorAlerts('Failed to delete level');
            }
        }
    };

    const openUpdateModal = (level) => {
        setSelectedLevel(level);
        setNewLevelName(level.l_name);
        setNewFacultyId(level.f_id);
        setNewDepartmentId(level.dpt_id);
        setShowUpdateModal(true);
    };

    const openAddModal = () => {
        setNewLevelName('');
        setNewFacultyId('');
        setNewDepartmentId('');
        setShowAddModal(true);
    };

    const handleAddLevel = async () => {
        if (!newDepartmentId) {
            setErrorAlerts('Please select a department.');
            return;
        }

        const existingLevel = levels.find((level) => level.l_name === newLevelName && level.f_id === newFacultyId);
        if (existingLevel) {
            alert('The level already exists for this faculty.');
            return;
        }

        try {
            await axios.post('http://127.0.0.1:8000/api/levels/', {
                l_name: newLevelName,
                f_id: newFacultyId,
                dpt_id: newDepartmentId,
            });
            setSuccessAlerts('Level added successfully');
            setShowAddModal(false);
            fetchFaculties();
        } catch (error) {
            setErrorAlerts('Failed to add level');
        }
    };

    // Configure DataTable columns
    const columns = [
        {
            name: '#',
            selector: (row, index) => index + 1,
            sortable: true,
            width: '50px',
        },
        {
            name: 'Level Name',
            selector: (row) => row.l_name,
            sortable: true,
        },
        {
            name: 'Faculty',
            selector: (row) => faculties.find((f) => f.f_id === parseInt(row.f_id))?.f_name || 'Loading...',
            sortable: true,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div>
                    <button className="btn btn-warning mx-2" onClick={() => openUpdateModal(row)}>
                        <i className="fas fa-pencil-alt"></i>
                    </button>
                    <button className="btn btn-danger mx-2" onClick={() => deleteThisLevel(row.l_id)}>
                        <i className="fas fa-trash"></i>
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="container mt-5">
            {successAlerts && <span className="text-success">{successAlerts}</span>}
            {errorAlerts && <span className="text-danger">{errorAlerts}</span>}

            <div className="d-flex justify-content-between mb-3">
                <h2>Levels Information</h2>
                <button className="btn btn-success" onClick={openAddModal}>
                    <i className="fas fa-plus"></i> Add New Level
                </button>
            </div>

            <DataTable
                columns={columns}
                data={levels}
                pagination
                paginationPerPage={5}
                highlightOnHover
                striped
                subHeader
                subHeaderComponent={
                    <input
                        type="text"
                        className="form-control w-25"
                        placeholder="Search Levels"
                        onChange={(e) =>
                            setLevels(
                                levels.filter((level) =>
                                    level.l_name.toLowerCase().includes(e.target.value.toLowerCase())
                                )
                            )
                        }
                    />
                }
                persistTableHead
            />

            {/* Add Modal */}
            {showAddModal && (
                <div className="modal show d-block custom-modal-position">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5>Add New Level</h5>
                                <button className="btn-close" onClick={() => setShowAddModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <label>Level Name</label>
                                <input
                                    type="text"
                                    className="form-control mb-3"
                                    value={newLevelName}
                                    onChange={(e) => setNewLevelName(e.target.value)}
                                />
                                <label>Select Faculty</label>
                                <select
                                    className="form-control mb-3"
                                    value={newFacultyId}
                                    onChange={(e) => setNewFacultyId(e.target.value)}
                                >
                                    <option value="">Select Faculty</option>
                                    {faculties.map((faculty) => (
                                        <option key={faculty.f_id} value={faculty.f_id}>
                                            {faculty.f_name}
                                        </option>
                                    ))}
                                </select>
                                <label>Select Department</label>
                                <select
                                    className="form-control"
                                    value={newDepartmentId}
                                    onChange={(e) => setNewDepartmentId(e.target.value)}
                                >
                                    <option value="">Select Department</option>
                                    {departments.map((dept) => (
                                        <option key={dept.dpt_id} value={dept.dpt_id}>
                                            {dept.dpt_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary" onClick={handleAddLevel}>
                                    Add Level
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Modal */}
            {showUpdateModal && selectedLevel && (
                <div className="modal show d-block custom-modal-position">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5>Update Level</h5>
                                <button className="btn-close" onClick={() => setShowUpdateModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <label>Level Name</label>
                                <input
                                    type="text"
                                    className="form-control mb-3"
                                    value={newLevelName}
                                    onChange={(e) => setNewLevelName(e.target.value)}
                                />
                                <label>Select Faculty</label>
                                <select
                                    className="form-control mb-3"
                                    value={newFacultyId}
                                    onChange={(e) => setNewFacultyId(e.target.value)}
                                >
                                    <option value="">Select Faculty</option>
                                    {faculties.map((faculty) => (
                                        <option key={faculty.f_id} value={faculty.f_id}>
                                            {faculty.f_name}
                                        </option>
                                    ))}
                                </select>
                                <label>Select Department</label>
                                <select
                                    className="form-control"
                                    value={newDepartmentId}
                                    onChange={(e) => setNewDepartmentId(e.target.value)}
                                >
                                    <option value="">Select Department</option>
                                    {departments.map((dept) => (
                                        <option key={dept.dpt_id} value={dept.dpt_id}>
                                            {dept.dpt_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary" onClick={handleUpdateLevel}>
                                    Update Level
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
