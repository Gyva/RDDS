import React, { useEffect, useState, useContext } from 'react';
import DataTable from 'react-data-table-component';
import { AuthContext } from '../contexts/AuthProvider';
import { utils, writeFile } from 'xlsx'; // Import necessary functions from xlsx
import './ManageSubmittedProjects.css';

const ManageSubmittedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('Approved'); // Default status
  const [loading, setLoading] = useState(true);
  const { auth, api, logout, refreshToken } = useContext(AuthContext);

  const APPROVAL_STATUSES = ['Approved', 'Rejected', 'Pending'];

  const fetchProjects = async () => {
    try {
      const response = await api.get('http://127.0.0.1:8000/api/projects/', {
        headers: {
          'Content-Type': 'application/json',// Include access token in request
        },
      });
      setProjects(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // If unauthorized, attempt token refresh
        try {
          await refreshToken();
          await fetchProjects(); // Retry fetching projects after token refresh
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          logout(); // Logout if refresh fails
        }
      } else {
        console.log('Error fetching projects:', error);
      }
      setLoading(false);
    }
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const columns = [
    { 
      name: 'Project ID', 
      selector: (row) => row.project_id, 
      sortable: true, 
      width: '100px' 
    },
    { 
      name: 'Title', 
      selector: (row) => row.title, 
      sortable: true, 
      width: '200px', 
      cell: (row) => (
        <div title={row.title}>
          {row.title.length > 30 ? `${row.title.slice(0, 30)}...` : row.title}
        </div>
      )
    },
    { 
      name: 'Case Study', 
      selector: (row) => row.case_study, 
      sortable: true, 
      width: '250px',
      cell: (row) => (
        <div title={row.case_study}>
          {row.case_study.length > 50 ? `${row.case_study.slice(0, 50)}...` : row.case_study}
        </div>
      )
    },
    { 
      name: 'Abstract', 
      selector: (row) => row.abstract, 
      sortable: true, 
      width: '300px', 
      cell: (row) => (
        <div title={row.abstract}>
          {row.abstract.length > 60 ? `${row.abstract.slice(0, 60)}...` : row.abstract}
        </div>
      )
    },
    { 
      name: 'Check Status', 
      selector: (row) => row.check_status, 
      sortable: true, 
      width: '150px' 
    },
    { 
      name: 'Completion Status', 
      selector: (row) => row.completion_status, 
      sortable: true, 
      width: '150px' 
    },
    { 
      name: 'Academic Year', 
      selector: (row) => row.academic_year, 
      sortable: true, 
      width: '150px' 
    },
  ];

  const filteredProjects = projects.filter((project) => {
    return project.approval_status === selectedStatus;
  });

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
      fetchProjects();
    };
  
    if (!projects.length) { // Fetch data only if projects state is empty
      fetchData();
    }
  }, [auth.accessToken, projects.length, refreshToken, logout]);

  // Function to generate the report
  const generateReport = () => {
    const reportData = filteredProjects.map(project => ({
      'Student': project.student_name, // Adjust according to your API structure
      'Supervisor': project.supervisor_name, // Adjust according to your API structure
      'Collaborator': project.collaborator_name, // Adjust according to your API structure
      'Project Title': project.title,
      'Approval Status': project.approval_status
    }));

    // Create a new workbook and add the report data to it
    const worksheet = utils.json_to_sheet(reportData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Project Report');

    // Export the Excel file
    writeFile(workbook, 'Project_Report.xlsx');
  };

  return (
    <div className="container">
      <h2>Manage Submitted Projects</h2>

      <div className="btn-group mb-3">
        {APPROVAL_STATUSES.map((status) => (
          <button
            key={status}
            className={`btn btn-${selectedStatus === status ? 'primary' : 'secondary'}`}
            onClick={() => handleStatusChange(status)}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="project-section">
        <h3>{selectedStatus} Projects</h3>
        <button className="btn btn-success mb-3" onClick={generateReport}>
          Generate Report
        </button>
        <DataTable
          columns={columns}
          data={filteredProjects}
          progressPending={loading}
          pagination
          responsive
          highlightOnHover
          noDataComponent="No projects available"
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
