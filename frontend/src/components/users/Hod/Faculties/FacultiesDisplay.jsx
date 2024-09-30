import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Display.css';

const FacultiesDisplay = () => {
    const [faculties, setFaculties] = useState([]);
    const [levels, setLevels] = useState({});
    const [departments, setDepartments] = useState({});
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [newFacultyName, setNewFacultyName] = useState('');
    const [newLevelName, setNewLevelName] = useState('');
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showAddLevelModal, setShowAddLevelModal] = useState(false);
    const [successAlerts, setSuccessAlerts] = useState(null);
    const [errorAlerts, setErrorAlerts] = useState(null);
    const [filterText, setFilterText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(5);
    const [selectedRows, setSelectedRows] = useState([]);

    // Fetch faculties and departments when the component mounts
    useEffect(() => {
        fetchFaculties();
        fetchDepartments();
    }, []);

    const fetchFaculties = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/faculties/');
            setFaculties(response.data);
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
            setErrorAlerts('Failed to update faculty');
        }
    };

    const handleAddLevel = async (f_id, dpt_id) => {
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
            setErrorAlerts('Failed to add level');
        }
    };

    // Handle search filter change
    const handleFilterTextChange = (e) => {
        setFilterText(e.target.value);
    };

    // Filter faculties based on search text
    const filteredFaculties = faculties.filter(faculty => 
        faculty.f_name && faculty.f_name.toLowerCase().includes(filterText.toLowerCase())
    );

    // Handle row selection in DataTable
    const handleRowSelected = (rows) => {
        setSelectedRows(rows.selectedRows);
    };

    // Pagination logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentFaculties = filteredFaculties.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredFaculties.length / rowsPerPage);

    const handleNextPage = () => {
        setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
    };

    const handlePreviousPage = () => {
        setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));
    };

    const columns = [
        {
            name: '#',
            selector: (row, index) => indexOfFirstRow + index + 1,
        },
        {
            name: 'Faculty',
            selector: (row) => row.f_name,
        },
        {
            name: 'Department',
            selector: (row) => departments[row.dpt_id] || 'Loading...',
        },
        {
            name: 'Number of Levels',
            selector: (row) => levels[row.f_id] ? levels[row.f_id].length : 0,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <>
                    <button
                        onClick={() => {
                            setSelectedFaculty(row);
                            setNewFacultyName(row.f_name);
                            setShowUpdateModal(true);
                        }}
                        className="btn btn-warning btn-sm"
                    >
                        <i className="fas fa-pencil-alt"></i>
                    </button>
                    <button
                        onClick={() => deleteThisFaculty(row.f_id)}
                        className="btn btn-danger btn-sm mx-1"
                    >
                        <i className="fas fa-trash"></i>
                    </button>
                    <button
                        onClick={() => {
                            setSelectedFaculty(row);
                            setShowAddLevelModal(true);
                        }}
                        className="btn btn-success btn-sm"
                        alt="Add Level to this faculty"
                    >
                        <i className="fas fa-plus"></i>
                    </button>
                </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];

    return (
        <div className="container mt-5">
            {successAlerts && (<span className='text-success'>{successAlerts}</span>)}
            {errorAlerts && (<span className='text-danger'>{errorAlerts}</span>)}
            <h2 className="mb-3 text-center">Faculties Information</h2>
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search Faculties"
                    value={filterText}
                    onChange={handleFilterTextChange}
                />
            </div>
            <DataTable
                columns={columns}
                data={currentFaculties}
                selectableRows
                onSelectedRowsChange={handleRowSelected}
                pagination={false}
                responsive
            />
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
                                <h5 className="modal-title">Updating the <b>{selectedFaculty.f_name}</b></h5>
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
                                <button type="button" className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-warning" onClick={handleUpdateFaculty}>
                                    Update Faculty Name
                                </button>
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
                                <h5 className="modal-title">Adding a Level to <b>{selectedFaculty.f_name}</b></h5>
                                <button type="button" className="btn-close" onClick={() => setShowAddLevelModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Level Name"
                                    value={newLevelName}
                                    onChange={(e) => setNewLevelName(e.target.value)}
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowAddLevelModal(false)}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-success" onClick={() => handleAddLevel(selectedFaculty.f_id, selectedFaculty.dpt_id)}>
                                    Add Level
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacultiesDisplay;
