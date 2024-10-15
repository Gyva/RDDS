import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import DataTable from 'react-data-table-component';
import { AuthContext } from '../contexts/AuthProvider';
import { utils, writeFile } from 'xlsx';
import './ManageSubmittedProjects.css';

const ManageSubmittedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // Search term for filtering
  const [activeSection, setActiveSection] = useState('Approved'); // Track the active section
  const { auth, api, logout, refreshToken } = useContext(AuthContext);

  const fetchProjectsWithNames = async () => {
    try {
      const response = await api.get('http://127.0.0.1:8000/api/projects/', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const projectsWithNames = await Promise.all(response.data.map(async (project) => {
        const studentDetails = project.student_id ? await getUserDetails(project.student_id, 'students') : { name: 'N/A', regNo: 'N/A' };
        const supervisorDetails = project.supervisor_id ? await getUserDetails(project.supervisor_id, 'supervisors') : { name: 'N/A', regNo: 'N/A' };

        return {
          ...project,
          student_name: studentDetails.name,
          student_reg: studentDetails.regNo,
          supervisor_name: supervisorDetails.name,
          supervisor_reg: supervisorDetails.regNo,
        };
      }));

      setProjects(projectsWithNames);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  const getUserDetails = async (id, userType) => {
    try {
      const response = await api.get(`http://127.0.0.1:8000/api/${userType}/${id}/`);
      return {
        name: `${response.data.fname} ${response.data.lname}`,
        regNo: response.data.reg_no || response.data.reg_num, // Assuming reg_number is the field for registration number
      };
    } catch (error) {
      console.error(`Error fetching ${userType} details:`, error);
      return { name: 'N/A', regNo: 'N/A' }; // Fallback if there's an error
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const columns = [
    { name: 'Project ID', selector: (row) => row.project_id, sortable: true, width: '100px' },
    { name: 'Title', selector: (row) => row.title, sortable: true, width: '200px', cell: (row) => <div title={row.title}>{row.title.length > 30 ? `${row.title.slice(0, 30)}...` : row.title}</div> },
    { name: 'Student Name', selector: (row) => row.student_name, sortable: true, width: '200px' },
    { name: 'Student Reg No', selector: (row) => row.student_reg, sortable: true, width: '150px' },
    { name: 'Supervisor Name', selector: (row) => row.supervisor_name, sortable: true, width: '200px' },
    { name: 'Supervisor Reg No', selector: (row) => row.supervisor_reg, sortable: true, width: '150px' },
    { name: 'Case Study', selector: (row) => row.case_study, sortable: true, width: '250px', cell: (row) => <div title={row.case_study}>{row.case_study.length > 50 ? `${row.case_study.slice(0, 50)}...` : row.case_study}</div> },
    { name: 'Abstract', selector: (row) => row.abstract, sortable: true, width: '300px', cell: (row) => <div title={row.abstract}>{row.abstract.length > 60 ? `${row.abstract.slice(0, 60)}...` : row.abstract}</div> },
    { name: 'Check Status', selector: (row) => row.check_status, sortable: true, width: '150px' },
    { name: 'Completion Status', selector: (row) => row.completion_status, sortable: true, width: '150px' },
    { name: 'Academic Year', selector: (row) => row.academic_year, sortable: true, width: '150px' },
    {
      name: 'Action',
      cell: (row) => (
        <Link to={`/projects/${row.project_id}`} className="btn btn-info btn-sm">
          View
        </Link>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const filteredProjects = (status) => {
    return projects.filter((project) => {
      return (
        project.approval_status === status &&
        (project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.supervisor_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
  };

  const completedProjects = projects.filter((project) => project.completion_status === true);

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.accessToken) {
        try {
          await refreshToken();
        } catch (error) {
          console.error('Token refresh failed:', error);
          logout(); // Logout user if token refresh fails
        }
      }
      fetchProjectsWithNames(); // Use the new function
    };

    fetchData(); // Always fetch data on component mount
  }, [auth.accessToken, refreshToken, logout]);

  // Function to generate the report
  const generateReport = (status) => {
    // Define the report title
    const reportTitle = `${status} Projects Report`;

    // Create the report data
    const reportData = filteredProjects(status).map((project) => ({
      'Student': project.student_name,
      'Student Reg No': project.student_reg,
      'Supervisor': project.supervisor_name,
      'Supervisor Reg No': project.supervisor_reg,
      'Project Title': project.title,
      'Approval Status': project.approval_status,
    }));

    // Create a new workbook and add the title row
    const worksheet = utils.json_to_sheet([{ Title: reportTitle }, {}, ...reportData]);

    // Create a new workbook
    const workbook = utils.book_new();

    // Append the worksheet to the workbook
    utils.book_append_sheet(workbook, worksheet, reportTitle);

    // Export the Excel file
    writeFile(workbook, `${status}_Projects_Report.xlsx`);
  };

  return (
    <div className="container">
      <h2>Manage Submitted Projects</h2>

      <div className="search-container mb-3">
        <input
          type="text"
          placeholder="Search by title, student, or supervisor..."
          className="form-control"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Navigation Buttons for Sections */}
      <div className="section-buttons mb-3">
        {['Approved', 'Pending', 'Rejected', 'Completed'].map((status) => (
          <button
            key={status}
            className={`btn ${activeSection === status ? 'btn-primary' : 'btn-secondary'} me-2`}
            onClick={() => setActiveSection(status)}
          >
            {status} Projects
          </button>
        ))}
      </div>

      {/* Dynamic Section Rendering */}
      <div className="project-section">
        <h3>{activeSection} Projects</h3>
        <button className="btn btn-success mb-3" onClick={() => generateReport(activeSection)}>
          Generate {activeSection} Projects Report
        </button>
        <DataTable
          columns={columns}
          data={activeSection === 'Completed' ? completedProjects : filteredProjects(activeSection)}
          progressPending={loading}
          pagination
          responsive
          highlightOnHover
          noDataComponent={`No ${activeSection.toLowerCase()} projects available`}
          customStyles={{
            cells: {
              style: {
                maxWidth: '150px', // Apply max-width to all cells for better fit
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default ManageSubmittedProjects;
