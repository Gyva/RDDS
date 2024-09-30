import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Display.css';
import DataTable from 'react-data-table-component';

const StudentsDisplay = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [successAlerts, setSuccessAlerts] = useState(null);
    const [errorAlerts, setErrorAlerts] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [newStudent, setNewStudent] = useState({
        reg_no: '',
        fname: '',
        lname: '',
        dob: '',
        email: '',
        phone: '',
        dpt_id: '',
        f_id: '',
        l_id: ''
    });

    const [departments, setDepartments] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [levels, setLevels] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        fetchStudents();
        fetchDepartments();
        fetchFaculties();
        fetchLevels();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/students/');
            const studentsWithDetails = await Promise.all(
                response.data.map(async (student) => {
                    const departmentName = await getDepartmentNameById(student.dpt_id);
                    const facultyName = await getFacultyNameById(student.f_id);
                    const levelName = await getLevelNameById(student.l_id);
                    return { ...student, departmentName, facultyName, levelName };
                })
            );
            setStudents(studentsWithDetails);
        } catch (error) {
            console.error('Error fetching students:', error);
            setErrorAlerts('Failed to fetch students');
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

    const fetchFaculties = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/faculties/');
            setFaculties(response.data);
        } catch (error) {
            console.error('Error fetching faculties:', error);
        }
    };

    const fetchLevels = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/levels/');
            setLevels(response.data);
        } catch (error) {
            console.error('Error fetching levels:', error);
        }
    };

    const getDepartmentNameById = async (id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/departments/${id}`);
            return response.data.dpt_name;
        } catch (error) {
            console.error('Error fetching department name:', error);
            return 'Unknown Department';
        }
    };

    const getFacultyNameById = async (id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/faculties/${id}`);
            return response.data.f_name;
        } catch (error) {
            console.error('Error fetching faculty name:', error);
            return 'Unknown Faculty';
        }
    };

    const getLevelNameById = async (id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/levels/${id}`);
            return response.data.l_name;
        } catch (error) {
            console.error('Error fetching level name:', error);
            return 'Unknown Level';
        }
    };

    // Handle student update
    const handleUpdateStudent = async () => {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/students/${selectedStudent.st_id}/`, newStudent);
            setErrorAlerts('');
            setSuccessAlerts('Student updated successfully');
            setShowUpdateModal(false);
            fetchStudents(); // Reload updated students
        } catch (error) {
            console.error('Error updating student:', error);
            setSuccessAlerts('');
            setErrorAlerts('Failed to update student');
        }
    };

    // Handle student delete
    const deleteThisStudent = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this student?');
        if (confirmDelete) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/students/${id}/`);
                setErrorAlerts('');
                setSuccessAlerts('Student deleted successfully');
                fetchStudents(); // Reload updated students
            } catch (error) {
                console.error('Error deleting student:', error);
                setSuccessAlerts('');
                setErrorAlerts('Failed to delete student');
            }
        }
    };

    // Open update modal
    const openUpdateModal = (student) => {
        setSelectedStudent(student);
        setNewStudent({
            reg_no: student.reg_no,
            fname: student.fname,
            lname: student.lname,
            dob: student.dob,
            email: student.email,
            phone: student.phone,
            dpt_id: student.dpt_id,
            f_id: student.f_id,
            l_id: student.l_id,
        });
        setShowUpdateModal(true);
    };

    // Filter faculties based on selected department
    const filteredFaculties = faculties.filter(faculty => faculty.dpt_id === newStudent.dpt_id);

    // Filter levels based on selected faculty
    const filteredLevels = levels.filter(level => level.f_id === newStudent.f_id);

    // Columns for the DataTable
    const columns = [
        { name: '#', selector: (_, index) => index + 1, sortable: true },
        { name: 'Registration No', selector: row => row.reg_no, sortable: true },
        { name: 'First Name', selector: row => row.fname, sortable: true },
        { name: 'Last Name', selector: row => row.lname, sortable: true },
        { name: 'Date of Birth', selector: row => row.dob || 'N/A', sortable: true },
        { name: 'Email', selector: row => row.email || 'N/A', sortable: true },
        { name: 'Phone', selector: row => row.phone || 'N/A', sortable: true },
        { name: 'Department', selector: row => row.departmentName, sortable: true },
        { name: 'Faculty', selector: row => row.facultyName, sortable: true },
        { name: 'Level', selector: row => row.levelName, sortable: true },
        {
            name: 'Actions',
            cell: (row) => (
                <>
                    <button
                        onClick={() => openUpdateModal(row)}
                        className="btn btn-warning me-2"
                    >
                        <i className="fas fa-pencil-alt"></i>
                    </button>
                    <button
                        onClick={() => deleteThisStudent(row.id)}
                        className="btn btn-danger"
                    >
                        <i className="fas fa-trash"></i>
                    </button>
                </>
            )
        }
    ];

    return (
        <div className="container mt-5">
            {successAlerts && <span className="text-success">{successAlerts}</span>}
            {errorAlerts && <span className="text-danger">{errorAlerts}</span>}
            <h2 className="mb-3 text-center">Student Information</h2>

            {/* React DataTable */}
            <DataTable
                columns={columns}
                data={students}
                pagination
                highlightOnHover
                pointerOnHover
                responsive
                paginationPerPage={5}
                paginationRowsPerPageOptions={[5, 10, 15, 20]}
                subHeader
                subHeaderComponent={
                    <input
                        type="text"
                        placeholder="Search"
                        className="form-control"
                        onChange={(e) => {
                            const searchTerm = e.target.value.toLowerCase();
                            setStudents(students.filter((student) => {
                                return Object.values(student).some((val) =>
                                    String(val).toLowerCase().includes(searchTerm)
                                );
                            }));
                        }}
                    />
                }
            />

            {/* Update Modal */}
            {showUpdateModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Update Student</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowUpdateModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="reg_no" className="form-label">Registration No</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="reg_no"
                                            value={newStudent.reg_no}
                                            onChange={(e) =>
                                                setNewStudent({ ...newStudent, reg_no: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="fname" className="form-label">First Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="fname"
                                            value={newStudent.fname}
                                            onChange={(e) =>
                                                setNewStudent({ ...newStudent, fname: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="lname" className="form-label">Last Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lname"
                                            value={newStudent.lname}
                                            onChange={(e) =>
                                                setNewStudent({ ...newStudent, lname: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="dob" className="form-label">Date of Birth</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="dob"
                                            value={newStudent.dob}
                                            onChange={(e) =>
                                                setNewStudent({ ...newStudent, dob: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            value={newStudent.email}
                                            onChange={(e) =>
                                                setNewStudent({ ...newStudent, email: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="phone" className="form-label">Phone</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="phone"
                                            value={newStudent.phone}
                                            onChange={(e) =>
                                                setNewStudent({ ...newStudent, phone: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="dpt_id" className="form-label">Department</label>
                                        <select
                                            className="form-control"
                                            id="dpt_id"
                                            value={newStudent.dpt_id}
                                            onChange={(e) =>
                                                setNewStudent({ ...newStudent, dpt_id: e.target.value })
                                            }
                                        >
                                            <option value="">Select Department</option>
                                            {departments.map((department) => (
                                                <option key={department.dpt_id} value={department.dpt_id}>
                                                    {department.dpt_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="f_id" className="form-label">Faculty</label>
                                        <select
                                            className="form-control"
                                            id="f_id"
                                            value={newStudent.f_id}
                                            onChange={(e) =>
                                                setNewStudent({ ...newStudent, f_id: e.target.value })
                                            }
                                        >
                                            <option value="">Select Faculty</option>
                                            {filteredFaculties.map((faculty) => (
                                                <option key={faculty.f_id} value={faculty.f_id}>
                                                    {faculty.f_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="l_id" className="form-label">Level</label>
                                        <select
                                            className="form-control"
                                            id="l_id"
                                            value={newStudent.l_id}
                                            onChange={(e) =>
                                                setNewStudent({ ...newStudent, l_id: e.target.value })
                                            }
                                        >
                                            <option value="">Select Level</option>
                                            {filteredLevels.map((level) => (
                                                <option key={level.l_id} value={level.l_id}>
                                                    {level.l_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </form>
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
                                    onClick={handleUpdateStudent}
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

export default StudentsDisplay;
