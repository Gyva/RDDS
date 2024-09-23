import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Display.css';

const StudentsDisplay = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [successAlerts, setSuccessAlerts] = useState(null);
    const [errorAlerts, setErrorAlerts] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(5); // Number of rows per page
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
        console.log(selectedStudent);
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

    // Pagination logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentStudents = students.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(students.length / rowsPerPage);

    const handleNextPage = () => {
        setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
    };

    const handlePreviousPage = () => {
        setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
    };

    const openUpdateModal = (student) => {
        setSelectedStudent(student);
        setNewStudent({
            reg_no: student.reg_no,  // Set but keep this read-only
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

    // Filter faculties based on the selected department
    const filteredFaculties = faculties.filter(faculty => faculty.dpt_id === newStudent.dpt_id);

    // Filter levels based on the selected faculty
    const filteredLevels = levels.filter(level => level.f_id === newStudent.f_id);

    return (
        <div className="container mt-5">
            {successAlerts && <span className="text-success">{successAlerts}</span>}
            {errorAlerts && <span className="text-danger">{errorAlerts}</span>}
            <h2 className="mb-3 text-center">Student Information</h2>
            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead style={{ backgroundColor: '#007bff', color: 'white' }}>
                        <tr>
                            <th>#</th>
                            <th>Registration No</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Date of Birth</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Department</th>
                            <th>Faculty</th>
                            <th>Level</th>
                            <th colSpan={2}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentStudents.map((student, index) => (
                            <tr key={student.id}>
                                <td>{indexOfFirstRow + index + 1}</td>
                                <td>{student.reg_no}</td>
                                <td>{student.fname}</td>
                                <td>{student.lname}</td>
                                <td>{student.dob || 'N/A'}</td>
                                <td>{student.email || 'N/A'}</td>
                                <td>{student.phone || 'N/A'}</td>
                                <td>{student.departmentName}</td>
                                <td>{student.facultyName}</td>
                                <td>{student.levelName}</td>
                                <td>
                                    <button
                                        onClick={() => openUpdateModal(student)}
                                        className="btn btn-warning"
                                    >
                                        <i className="fas fa-pencil-alt"></i> Update
                                    </button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => deleteThisStudent(student.id)}
                                        className="btn btn-danger"
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

            {/* Update Modal */}
            {showUpdateModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Update Student Information</h5>
                                <button type="button" className="btn-close" onClick={() => setShowUpdateModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <label htmlFor="regNo">Registration No</label>
                                <input
                                    id="regNo"
                                    type="text"
                                    className="form-control mb-3"
                                    value={newStudent.reg_no}
                                    readOnly
                                />
                                <label htmlFor="fname">First Name</label>
                                <input
                                    id="fname"
                                    type="text"
                                    className="form-control mb-3"
                                    value={newStudent.fname}
                                    onChange={(e) => setNewStudent({ ...newStudent, fname: e.target.value })}
                                />
                                <label htmlFor="lname">Last Name</label>
                                <input
                                    id="lname"
                                    type="text"
                                    className="form-control mb-3"
                                    value={newStudent.lname}
                                    onChange={(e) => setNewStudent({ ...newStudent, lname: e.target.value })}
                                />
                                <label htmlFor="dob">Date of Birth</label>
                                <input
                                    id="dob"
                                    type="date"
                                    className="form-control mb-3"
                                    value={newStudent.dob}
                                    onChange={(e) => setNewStudent({ ...newStudent, dob: e.target.value })}
                                />
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    className="form-control mb-3"
                                    value={newStudent.email}
                                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                                />
                                <label htmlFor="phone">Phone</label>
                                <input
                                    id="phone"
                                    type="text"
                                    className="form-control mb-3"
                                    value={newStudent.phone}
                                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                                />
                                
                                <label htmlFor="dptId">Department</label>
                                <select
                                    id="dptId"
                                    className="form-control mb-3"
                                    value={newStudent.dpt_id}
                                    onChange={(e) => setNewStudent({ ...newStudent, dpt_id: e.target.value, f_id: '', l_id: '' })}
                                >
                                    <option value="">Select Department</option>
                                    {departments.map((department) => (
                                        <option key={department.id} value={department.id}>
                                            {department.dpt_name}
                                        </option>
                                    ))}
                                </select>

                                <label htmlFor="fId">Faculty</label>
                                <select
                                    id="fId"
                                    className="form-control mb-3"
                                    value={newStudent.f_id}
                                    onChange={(e) => setNewStudent({ ...newStudent, f_id: e.target.value, l_id: '' })}
                                >
                                    <option value="">Select Faculty</option>
                                    {filteredFaculties.map((faculty) => (
                                        <option key={faculty.id} value={faculty.id}>
                                            {faculty.f_name}
                                        </option>
                                    ))}
                                </select>

                                <label htmlFor="lId">Level</label>
                                <select
                                    id="lId"
                                    className="form-control mb-3"
                                    value={newStudent.l_id}
                                    onChange={(e) => setNewStudent({ ...newStudent, l_id: e.target.value })}
                                >
                                    <option value="">Select Level</option>
                                    {filteredLevels.map((level) => (
                                        <option key={level.id} value={level.id}>
                                            {level.l_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleUpdateStudent}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentsDisplay;
