import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './DepartmentDisplay.css';

const DepartmentsDisplay = () => {
    const [departments, setDepartments] = useState([]);
    const [facultiesCount, setFacultiesCount] = useState({});
    const [loading, setLoading] = useState(true);
    const [errorAlerts, setErrorAlerts] = useState(null);
    const [newDepartmentName, setNewDepartmentName] = useState('');
    const [showDepartmentModal, setShowDepartmentModal] = useState(false);
    const [showFacultyModal, setShowFacultyModal] = useState(false);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
    const [selectedDepartmentName, setSelectedDepartmentName] = useState(''); // New state for the selected department name
    const [newFacultyName, setNewFacultyName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/departments/');
            setDepartments(response.data);
            setLoading(false);
            response.data.forEach(department => {
                fetchFacultiesCount(department.dpt_id);
            });
        } catch (error) {
            console.error('Error fetching departments:', error);
            setErrorAlerts('Failed to fetch departments');
            setLoading(false);
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
                setDepartments(departments.filter(dep => dep.dpt_id !== id));
            } catch (error) {
                console.error('Error deleting department:', error);
                setErrorAlerts('Failed to delete department');
            }
        }
    };

    const addDepartment = async () => {
        if (!newDepartmentName.trim()) {
            setErrorAlerts('Department name cannot be empty');
            return;
        }

        try {
            await axios.post('http://127.0.0.1:8000/api/departments/', { dpt_name: newDepartmentName });
            fetchDepartments();
            setNewDepartmentName('');
            setShowDepartmentModal(false);
        } catch (error) {
            console.error('Error adding department:', error);
            setErrorAlerts('Failed to add department');
        }
    };

    const addFaculty = async () => {
        if (!newFacultyName.trim() || !selectedDepartmentId) {
            setErrorAlerts('Faculty name and department must be selected.');
            return;
        }

        try {
            await axios.post('http://127.0.0.1:8000/api/faculties/', {
                f_name: newFacultyName,
                dpt_id: selectedDepartmentId
            });
            fetchFacultiesCount(selectedDepartmentId);
            setNewFacultyName('');
            setShowFacultyModal(false);
        } catch (error) {
            console.error('Error adding faculty:', error);
            setErrorAlerts('Failed to add faculty');
        }
    };

    const columns = [
        {
            name: '#',
            selector: (row, index) => index + 1,
            sortable: true,
        },
        {
            name: 'Department Name',
            selector: row => row.dpt_name,
            sortable: true,
        },
        {
            name: 'No. of Faculties',
            selector: row => facultiesCount[row.dpt_id] || '0',
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <>
                    <button 
                        className="btn btn-warning me-2" 
                        onClick={() => {/* Update logic here */}}>
                        <i className="fas fa-pencil-alt"></i>
                    </button>
                    <button 
                        className="btn btn-danger me-2" 
                        onClick={() => deleteThisDepartment(row.dpt_id)}>
                        <i className="fas fa-trash"></i>
                    </button>
                    <button 
                        className="btn btn-success" 
                        onClick={() => {
                            setSelectedDepartmentId(row.dpt_id); // Set the selected department ID
                            setSelectedDepartmentName(row.dpt_name); // Set the selected department name
                            setShowFacultyModal(true); // Show the faculty modal
                        }}>
                        <i className="fas fa-plus"></i> Add Faculty
                    </button>
                </>
            ),
        },
    ];

    return (
        <div className="container mt-5">
            {errorAlerts && (<span className='flex justify-content-end text-danger'>{errorAlerts}</span>)}
            <h2 className="mb-3 text-center">Departments Information</h2>
            <DataTable
                columns={columns}
                data={departments}
                progressPending={loading}
                pagination
                highlightOnHover
                striped
                responsive
                subHeader
                subHeaderComponent={
                    <button 
                        className="btn btn-success"
                        onClick={() => setShowDepartmentModal(true)}>
                        <i className="fas fa-plus"></i> Add Department
                    </button>
                }
                paginationPerPage={5}
            />

            {/* Modal for adding department */}
            <div className={`modal fade ${showDepartmentModal ? 'show' : ''}`} style={{ display: showDepartmentModal ? 'block' : 'none' }} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden={!showDepartmentModal}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Add New Department</h5>
                            <button type="button" className="close" onClick={() => setShowDepartmentModal(false)}>
                                <span>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Department Name"
                                value={newDepartmentName}
                                onChange={(e) => setNewDepartmentName(e.target.value)}
                            />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowDepartmentModal(false)}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={addDepartment}>Add Department</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for adding faculty */}
            <div className={`modal fade ${showFacultyModal ? 'show' : ''}`} style={{ display: showFacultyModal ? 'block' : 'none' }} role="dialog" aria-labelledby="facultyModalLabel" aria-hidden={!showFacultyModal}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="facultyModalLabel">Add New Faculty to {selectedDepartmentName}</h5> {/* Use the selected department name here */}
                            <button type="button" className="close" onClick={() => setShowFacultyModal(false)}>
                                <span>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Faculty Name"
                                value={newFacultyName}
                                onChange={(e) => setNewFacultyName(e.target.value)}
                            />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowFacultyModal(false)}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={addFaculty}>Add Faculty</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentsDisplay;
