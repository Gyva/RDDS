import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const SupervisorsDisplay = () => {
    const [supervisors, setSupervisors] = useState([]);
    const [filteredSupervisors, setFilteredSupervisors] = useState([]);
    const [selectedSupervisor, setSelectedSupervisor] = useState(null);
    const [currentSupervisor, setCurrentSupervisor] = useState(null);
    const [successAlerts, setSuccessAlerts] = useState('');
    const [errorAlerts, setErrorAlerts] = useState('');
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [departments, setDepartments] = useState();
    const [newSupervisor, setNewSupervisor] = useState({
        reg_num: '',
        fname: '',
        lname: '',
        email: '',
        phone: '',
        dpt_id: '',
        specialization: '',
        role: '',
    });
    const [searchQuery, setSearchQuery] = useState('');

    const fetchDepartments = async () => {
        const URL = "http://127.0.0.1:8000/api/departments/"
        try {
            const response = await axios(URL, {
                headers: {
                    'Content-Type': 'json/application'
                }
            });
            setDepartments(response.data);
            setErrorAlerts('');
        } catch (error) {
            console.error('Error fetching departments:', error);
            setErrorAlerts('Failed to fetch departments');
        }
    };

    const getDepartmentName = (id) => {
        const department = departments?.find((dpt) => dpt.dpt_id === id);
        return department ? department.dpt_name : 'N/A';
    };

    const fetchSupervisors = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/supervisors/');
            setSupervisors(response.data);
            setFilteredSupervisors(response.data);
            setErrorAlerts('');
        } catch (error) {
            console.error('Error fetching supervisors:', error);
            setErrorAlerts('Failed to fetch supervisors');
        }
    };

    const handleUpdateSupervisor = async () => {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/supervisors/${currentSupervisor}/`, newSupervisor);
            setSuccessAlerts('Supervisor updated successfully');
            setShowUpdateModal(false);
            fetchSupervisors();
        } catch (error) {
            console.error('Error updating supervisor:', error);
            setErrorAlerts('Failed to update supervisor');
        }
    };

    const deleteThisSupervisor = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this supervisor?');
        if (confirmDelete) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/supervisors/${id}/`);
                setSuccessAlerts('Supervisor deleted successfully');
                fetchSupervisors();
            } catch (error) {
                console.error('Error deleting supervisor:', error);
                setErrorAlerts('Failed to delete supervisor');
            }
        }
    };

    useEffect(() => {
        fetchSupervisors();
        fetchDepartments();
    }, []);

    const openUpdateModal = (supervisor, id) => {
        setCurrentSupervisor(id);
        setSelectedSupervisor(supervisor);
        setNewSupervisor({
            reg_num: supervisor.reg_num,
            fname: supervisor.fname,
            lname: supervisor.lname,
            email: supervisor.email,
            phone: supervisor.phone,
            dpt_id: supervisor.dpt_id,
            specialization: supervisor.specialization,
            role: supervisor.role,
        });
        setShowUpdateModal(true);
    };

    // Handle search filtering
    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchQuery(value);
        const filtered = supervisors.filter((supervisor) =>
            supervisor.fname.toLowerCase().includes(value.toLowerCase()) ||
            supervisor.lname.toLowerCase().includes(value.toLowerCase()) ||
            supervisor.email.toLowerCase().includes(value.toLowerCase()) ||
            supervisor.reg_num.toLowerCase().includes(value.toLowerCase()) ||
            getDepartmentName(supervisor.dpt_id).toLowerCase().includes(value.toLowerCase()) ||
            supervisor.specialization.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSupervisors(filtered);
    };

    // Define the columns for the data table
    const columns = [
        {
            name: '#',
            selector: (row, index) => index + 1,
            sortable: true,
        },
        {
            name: 'Registration Number',
            selector: (row) => row.reg_num,
            sortable: true,
        },
        {
            name: 'First Name',
            selector: (row) => row.fname,
            sortable: true,
        },
        {
            name: 'Last Name',
            selector: (row) => row.lname,
            sortable: true,
        },
        {
            name: 'Email',
            selector: (row) => row.email,
            sortable: true,
        },
        {
            name: 'Phone',
            selector: (row) => row.phone,
            sortable: true,
        },
        {
            name: 'Department',
            selector: (row) => getDepartmentName(row.dpt_id),
            sortable: true,
        },
        {
            name: 'Specialization',
            selector: (row) => row.specialization,
            sortable: true,
        },
        {
            name: 'Role',
            selector: (row) => row.role,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div>
                    <button onClick={() => openUpdateModal(row, row.sup_id)} className="btn btn-warning me-2">
                        <i className="fas fa-pencil-alt"></i>
                    </button>
                    <button onClick={() => deleteThisSupervisor(row.sup_id)} className="btn btn-danger">
                        <i className="fas fa-trash"></i>
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="container mt-5">
            {successAlerts && <div className="alert alert-success">{successAlerts}</div>}
            {errorAlerts && <div className="alert alert-danger">{errorAlerts}</div>}
            <h2 className="mb-3 text-center">Supervisor Information</h2>

            {/* Search input */}
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search Supervisors..."
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>

            <DataTable
                columns={columns}
                data={filteredSupervisors}
                pagination
                responsive
                highlightOnHover
                defaultSortFieldId="reg_num"
            />

            {/* Update Modal */}
            {showUpdateModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Update Supervisor Information</h5>
                                <button type="button" className="btn-close" onClick={() => setShowUpdateModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <label htmlFor="regNum">Registration Number</label>
                                <input id="regNum" type="text" className="form-control mb-3" value={newSupervisor.reg_num} readOnly />
                                <label htmlFor="fname">First Name</label>
                                <input id="fname" type="text" className="form-control mb-3" value={newSupervisor.fname} onChange={(e) => setNewSupervisor({ ...newSupervisor, fname: e.target.value })} />
                                <label htmlFor="lname">Last Name</label>
                                <input id="lname" type="text" className="form-control mb-3" value={newSupervisor.lname} onChange={(e) => setNewSupervisor({ ...newSupervisor, lname: e.target.value })} />
                                <label htmlFor="email">Email</label>
                                <input id="email" type="email" className="form-control mb-3" value={newSupervisor.email} onChange={(e) => setNewSupervisor({ ...newSupervisor, email: e.target.value })} />
                                <label htmlFor="phone">Phone</label>
                                <input id="phone" type="text" className="form-control mb-3" value={newSupervisor.phone} onChange={(e) => setNewSupervisor({ ...newSupervisor, phone: e.target.value })} />
                                <label htmlFor="department">Department</label>
                                <select
                                    id="department"
                                    className="form-control mb-3"
                                    value={newSupervisor.dpt_id}
                                    onChange={(e) => setNewSupervisor({ ...newSupervisor, dpt_id: e.target.value })}
                                >
                                    {departments && departments.map((dpt) => (
                                        <option key={dpt.dpt_id} value={dpt.dpt_id}>
                                            {dpt.dpt_name}
                                        </option>
                                    ))}
                                </select>
                                <label htmlFor="specialization">Specialization</label>
                                <input id="specialization" type="text" className="form-control mb-3" value={newSupervisor.specialization} onChange={(e) => setNewSupervisor({ ...newSupervisor, specialization: e.target.value })} />
                                <label htmlFor="role">Role</label>
                                <select id="role" className="form-control mb-3" value={newSupervisor.role} onChange={(e) => setNewSupervisor({ ...newSupervisor, role: e.target.value })}>
                                    <option value="Professor">Professor</option>
                                    <option value="Senior Lecturer">Senior Lecturer</option>
                                    <option value="Lecturer">Lecturer</option>
                                </select>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleUpdateSupervisor}>
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupervisorsDisplay;
