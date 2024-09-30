import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import useGetDataHook from '../../../../hooks/useGetDataHook';

const StudentsDisplay = () => {
    STUDENTS_URL = "http://127.0.0.1:8000/api/students/"
    const [students, setStudent] = useState(null);
    const {data,errMsg} = useGetDataHook(STUDENTS_URL);


    const handleClick = (student) => {
        setSelectedStudent(student);
    };

    const getDepartmentNameById = (id) => {
        URL = `http://127.0.0.1:8000/api/departments/${id}`;
        const {data,errMsg} = useGetDataHook(URL);
        if (data) {
            return data.dpt_name;
        }
        else{
            console.error(errMsg);
        }
    }

    return (
        <div className="container mt-5">
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
                            <th>Department ID</th>
                            <th>Faculty ID</th>
                            <th>Level ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((student, index) => (
                            <tr key={student.id}>
                                <td>{index + 1}</td>
                                <td>
                                    <a
                                        href="#"
                                        className="reg-number"
                                        data-bs-toggle="modal"
                                        data-bs-target="#studentModal"
                                        onClick={() => handleClick(student)}
                                    >
                                        {student.regno}
                                    </a>
                                </td>
                                <td>{student.name.split(' ')[0]}</td>
                                <td>{student.name.split(' ')[1]}</td>
                                <td>{student.dob}</td>
                                <td>{student.email}</td>
                                <td>{student.phone}</td>
                                <td>{getDepartmentNameById(student.dept)}</td>
                                <td>{student.faculty}</td>
                                <td>{student.level}</td>
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {selectedStudent && (
                <div
                    className="modal fade show"
                    id="studentModal"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="studentModalLabel"
                    aria-hidden="true"
                    style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="studentModalLabel">
                                    Student Information
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={() => setSelectedStudent(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">{selectedStudent.name}</h5>
                                        <img
                                            id="modal-img"
                                            src={selectedStudent.img}
                                            alt="Student"
                                            className="img-fluid rounded"
                                        />
                                        <p className="card-text">
                                            <strong>Registration No:</strong> {selectedStudent.regno}
                                            <br />
                                            <strong>Date of Birth:</strong> {selectedStudent.dob}
                                            <br />
                                            <strong>Email:</strong> {selectedStudent.email}
                                            <br />
                                            <strong>Phone:</strong> {selectedStudent.phone}
                                            <br />
                                            <strong>Department ID:</strong> {selectedStudent.dept}
                                            <br />
                                            <strong>Faculty ID:</strong> {selectedStudent.faculty}
                                            <br />
                                            <strong>Level ID:</strong> {selectedStudent.level}
                                            <br />
                                            <strong>Account:</strong> {selectedStudent.account}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                    onClick={() => setSelectedStudent(null)}
                                >
                                    Close
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
