import React, { useEffect, useState, useContext } from 'react';
import * as XLSX from 'xlsx';
import { AuthContext } from '../contexts/AuthProvider'; // Assuming you have an AuthContext for user role and details
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported

const DepartmentReport = () => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('both'); // State for view mode
    const [userDepartment, setUserDepartment] = useState(null); // Store user's department
    const { auth, api } = useContext(AuthContext); // Access auth for role and reg_no

    useEffect(() => {
        const fetchData = async () => {
            try {
                let departmentId = null;

                // Fetch all supervisors
                const responseSupervisors = await api.get('http://127.0.0.1:8000/api/supervisors/');
                const supervisors = responseSupervisors.data;

                // Fetch all projects
                const responseProjects = await api.get('http://127.0.0.1:8000/api/projects/');
                const projects = responseProjects.data;

                // If the user is HOD, find the supervisor whose reg_no matches auth.user.reg_no
                if (auth.role === 'HOD') {
                    const supervisor = supervisors.find(sup => sup.reg_num === auth.user);
                    if (supervisor) {
                        departmentId = supervisor.department;
                        setUserDepartment(departmentId);
                    } else {
                        setError('No supervisor found for this HOD.');
                        return;
                    }
                }

                // Fetch all students
                const responseStudents = await api.get('http://127.0.0.1:8000/api/students/');
                const students = responseStudents.data;

                // Filter data based on role and department
                const filteredStudents = auth.role === 'HOD' ? students.filter(student => student.department === departmentId) : students;
                const filteredSupervisors = auth.role === 'HOD' ? supervisors.filter(supervisor => supervisor.department === departmentId) : supervisors;

                // For each supervisor, count the number of assigned students based on projects
                const supervisorsWithStudentCount = filteredSupervisors.map(supervisor => {
                    const studentsAssigned = projects.filter(project =>
                        project.supervisor_id === supervisor.sup_id && project.student_id !== null
                    ).length;
                    return { ...supervisor, studentsCount: studentsAssigned };
                });

                // Group students and supervisors by department
                const groupedData = groupByDepartment(filteredStudents, supervisorsWithStudentCount);
                setData(groupedData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [auth]);

    const groupByDepartment = (students, supervisors) => {
        const grouped = {};

        // Group students by department
        students.forEach(student => {
            const { department } = student;
            if (!grouped[department]) {
                grouped[department] = { supervisors: [], students: [] };
            }
            grouped[department].students.push(student);
        });

        // Group supervisors by department
        supervisors.forEach(supervisor => {
            const { department } = supervisor;
            if (!grouped[department]) {
                grouped[department] = { supervisors: [], students: [] };
            }
            grouped[department].supervisors.push(supervisor);
        });

        return grouped;
    };

    const handleGenerateReport = (department) => {
        const { supervisors, students } = data[department];

        // Prepare data for Excel
        const reportData = [];

        // Add supervisors data
        supervisors.forEach(supervisor => {
            reportData.push({
                Name: supervisor.fname + ' ' + supervisor.lname,
                RegNo: supervisor.reg_num,
                Department: department,
                Type: 'Supervisor',
                StudentsAssigned: supervisor.studentsCount || 0, // Ensure students count is available
            });
        });

        // Add students data
        students.forEach(student => {
            reportData.push({
                Name: student.fname,
                RegNo: student.reg_no,
                Department: department,
                Type: 'Student',
                StudentsAssigned: '', // No students assigned for students
            });
        });

        // Create a new workbook
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(reportData);

        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

        // Generate the file name
        const fileName = `Report_${department}.xlsx`;

        // Save to file
        XLSX.writeFile(workbook, fileName);
    };

    if (loading) return <p className="text-center">Loading...</p>;
    if (error) return <p className="text-center text-danger">{error}</p>;

    return (
        <div className="container mt-4">
            {/* View Mode Selection */}
            <div className="text-center mb-3">
                <label className="mx-2">
                    <input 
                        type="radio" 
                        name="viewMode" 
                        value="both" 
                        checked={viewMode === 'both'} 
                        onChange={() => setViewMode('both')} 
                        className="me-1"
                    />
                    Both
                </label>
                <label className="mx-2">
                    <input 
                        type="radio" 
                        name="viewMode" 
                        value="supervisors" 
                        checked={viewMode === 'supervisors'} 
                        onChange={() => setViewMode('supervisors')} 
                        className="me-1"
                    />
                    Supervisors Only
                </label>
                <label className="mx-2">
                    <input 
                        type="radio" 
                        name="viewMode" 
                        value="students" 
                        checked={viewMode === 'students'} 
                        onChange={() => setViewMode('students')} 
                        className="me-1"
                    />
                    Students Only
                </label>
            </div>

            {Object.entries(data).map(([department, { supervisors, students }]) => (
                <div key={department} className="mb-4">
                    <h3>{department}</h3>
                    <button className="btn btn-primary mb-2" onClick={() => handleGenerateReport(department)}>Generate Report</button>

                    {/* Render based on view mode */}
                    {viewMode !== 'students' && (
                        <>
                            <h4>Supervisors:</h4>
                            {supervisors.length > 0 ? (
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Reg No</th>
                                            <th>Students Assigned</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {supervisors.map((supervisor) => (
                                            <tr key={supervisor.id}>
                                                <td>{supervisor.fname} {supervisor.lname}</td>
                                                <td>{supervisor.reg_num}</td>
                                                <td>{supervisor.studentsCount || 0}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No supervisors available</p>
                            )}
                        </>
                    )}

                    {viewMode !== 'supervisors' && (
                        <>
                            <h4>Students:</h4>
                            {students.length > 0 ? (
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Reg No</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((student) => (
                                            <tr key={student.id}>
                                                <td>{student.fname} {student.lname}</td>
                                                <td>{student.reg_no}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No students available</p>
                            )}
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default DepartmentReport;
