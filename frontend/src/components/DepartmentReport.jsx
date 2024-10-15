import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const DepartmentReport = () => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('both'); // State for view mode

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseStudents = await axios.get('http://127.0.0.1:8000/api/students/');
                const responseSupervisors = await axios.get('http://127.0.0.1:8000/api/supervisors/');

                const students = responseStudents.data;
                const supervisors = responseSupervisors.data;

                // Group students and supervisors by department
                const groupedData = groupByDepartment(students, supervisors);
                setData(groupedData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
                Name: supervisor.name,
                RegNo: supervisor.regNo,
                Department: department,
                Type: 'Supervisor',
                StudentsAssigned: supervisor.studentsCount || 0, // Ensure students count is available
            });
        });

        // Add students data
        students.forEach(student => {
            reportData.push({
                Name: student.name,
                RegNo: student.regNo,
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            {/* View Mode Selection */}
            <div>
                <label>
                    <input 
                        type="radio" 
                        name="viewMode" 
                        value="both" 
                        checked={viewMode === 'both'} 
                        onChange={() => setViewMode('both')} 
                    />
                    Both
                </label>
                <label>
                    <input 
                        type="radio" 
                        name="viewMode" 
                        value="supervisors" 
                        checked={viewMode === 'supervisors'} 
                        onChange={() => setViewMode('supervisors')} 
                    />
                    Supervisors Only
                </label>
                <label>
                    <input 
                        type="radio" 
                        name="viewMode" 
                        value="students" 
                        checked={viewMode === 'students'} 
                        onChange={() => setViewMode('students')} 
                    />
                    Students Only
                </label>
            </div>

            {Object.entries(data).map(([department, { supervisors, students }]) => (
                <div key={department} style={{ margin: '20px 0', border: '1px solid gray', padding: '10px' }}>
                    <h3>{department}</h3>
                    <button onClick={() => handleGenerateReport(department)}>Generate Report</button>

                    {/* Render based on view mode */}
                    {viewMode !== 'students' && (
                        <>
                            <h4>Supervisors:</h4>
                            {supervisors.length > 0 ? (
                                <ul>
                                    {supervisors.map((supervisor) => (
                                        <li key={supervisor.id}>
                                            {supervisor.name} (Reg No: {supervisor.regNo}, Students Assigned: {supervisor.studentsCount || 0})
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No supervisors available</p>
                            )}
                        </>
                    )}

                    {viewMode !== 'supervisors' && (
                        <>
                            <h4>Students:</h4>
                            {students.length > 0 ? (
                                <ul>
                                    {students.map((student) => (
                                        <li key={student.id}>
                                            {student.name} (Reg No: {student.regNo})
                                        </li>
                                    ))}
                                </ul>
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
