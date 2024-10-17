import React, { useEffect, useState, useContext } from 'react';
import * as XLSX from 'xlsx';
import DataTable from 'react-data-table-component'; // Importing DataTable
import { AuthContext } from '../contexts/AuthProvider';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importing Bootstrap for styling

const DepartmentReport = () => {
    const [data, setData] = useState({});
    const [departments, setDepartments] = useState([]); // To store department data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('both');
    const [userDepartment, setUserDepartment] = useState(null);
    const { auth, api } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let departmentId = null;

                // Fetch departments
                const responseDepartments = await api.get('http://127.0.0.1:8000/api/departments/');
                const departmentsData = responseDepartments.data;
                setDepartments(departmentsData); // Set the department data

                // Fetch supervisors
                const responseSupervisors = await api.get('http://127.0.0.1:8000/api/supervisors/');
                const supervisors = responseSupervisors.data;

                // Fetch projects
                const responseProjects = await api.get('http://127.0.0.1:8000/api/projects/');
                const projects = responseProjects.data;

                // If HOD, find the user's department
                if (auth.role === 'HOD') {
                    const supervisor = supervisors.find(sup => sup.reg_num === auth.user);
                    if (supervisor) {
                        departmentId = supervisor.dpt_id;
                        setUserDepartment(departmentId);
                    } else {
                        setError('No supervisor found for this HOD.');
                        return;
                    }
                }

                // Fetch students
                const responseStudents = await api.get('http://127.0.0.1:8000/api/students/');
                const students = responseStudents.data;

                // Filter students and supervisors based on department for HOD
                const filteredStudents = auth.role === 'HOD' ? students.filter(student => student.department === departmentId) : students;
                const filteredSupervisors = auth.role === 'HOD' ? supervisors.filter(supervisor => supervisor.department === departmentId) : supervisors;

                // Add student count to each supervisor
                const supervisorsWithStudentCount = filteredSupervisors.map(supervisor => {
                    const studentsAssigned = projects.filter(project => project.supervisor_id === supervisor.sup_id && project.student_id !== null).length;
                    return { ...supervisor, studentsCount: studentsAssigned };
                });

                // Group data by department and attach department names
                const groupedData = groupByDepartment(filteredStudents, supervisorsWithStudentCount, departmentsData);
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

    // Group students and supervisors by department and include department names
    const groupByDepartment = (students, supervisors, departments) => {
        const grouped = {};

        students.forEach(student => {
            const { dpt_id } = student;
            const departmentName = getDepartmentName(dpt_id, departments);
            if (!grouped[dpt_id]) {
                grouped[dpt_id] = { departmentName, supervisors: [], students: [] };
            }
            grouped[dpt_id].students.push(student);
        });

        supervisors.forEach(supervisor => {
            const { dpt_id } = supervisor;
            const departmentName = getDepartmentName(dpt_id, departments);
            if (!grouped[dpt_id]) {
                grouped[dpt_id] = { departmentName, supervisors: [], students: [] };
            }
            grouped[dpt_id].supervisors.push(supervisor);
        });

        return grouped;
    };

    // Find department name by ID
    const getDepartmentName = (dpt_id, departments) => {
        console.log(departments)
        const department = departments?.find(dep => dep.dpt_id === dpt_id);
        console.log(department)
        return department ? department.dpt_name : 'Unknown Department';
    };

    // Handle report generation in XLSX format
    const handleGenerateReport = (departmentId) => {
        const { departmentName, supervisors, students } = data[departmentId];
        const reportData = [];

        supervisors.forEach(supervisor => {
            reportData.push({
                Name: supervisor.fname + ' ' + supervisor.lname,
                RegNo: supervisor.reg_num,
                Department: departmentName,
                Type: 'Supervisor',
                StudentsAssigned: supervisor.studentsCount || 0,
            });
        });

        students.forEach(student => {
            reportData.push({
                Name: student.fname + " " + student.lname,
                RegNo: student.reg_no,
                Department: departmentName,
                Type: 'Student',
                StudentsAssigned: '',
            });
        });

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(reportData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
        const fileName = `Report_${departmentName}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    };

    // Prepare data for DataTable view based on the selected view mode
    const prepareDataForView = (departmentData) => {
        let result = [];
        if (viewMode !== 'students') {
            result = result.concat(departmentData.supervisors.map(supervisor => ({
                name: supervisor.fname + ' ' + supervisor.lname,
                reg_no: supervisor.reg_num,
                type: 'Supervisor',
                department: departmentData.departmentName,
                studentsAssigned: supervisor.studentsCount || 0
            })));
        }
        if (viewMode !== 'supervisors') {
            result = result.concat(departmentData.students.map(student => ({
                name: student.fname + ' ' + student.lname,
                reg_no: student.reg_no,
                type: 'Student',
                department: departmentData.departmentName,
                studentsAssigned: ''
            })));
        }
        return result;
    };

    // DataTable columns
    const columns = [
        { name: 'Name', selector: row => row.name, sortable: true },
        { name: 'Reg No', selector: row => row.reg_no, sortable: true },
        { name: 'Department', selector: row => row.department, sortable: true },
        { name: 'Type', selector: row => row.type, sortable: true },
        { name: 'Students Assigned', selector: row => row.studentsAssigned, sortable: true }
    ];

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

            {Object.entries(data).map(([departmentId, departmentData]) => (
                <div key={departmentId} className="mb-4">
                    <h3>{departmentData.departmentName}</h3>
                    <button className="btn btn-primary mb-2" onClick={() => handleGenerateReport(departmentId)}>Generate Report</button>

                    {/* Display the data table */}
                    <DataTable
                        columns={columns}
                        data={prepareDataForView(departmentData)}
                        pagination
                        highlightOnHover
                        striped
                    />
                </div>
            ))}
        </div>
    );
};

export default DepartmentReport;
