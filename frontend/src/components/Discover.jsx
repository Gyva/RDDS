import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import './Discover.css';
import { AuthContext } from '../contexts/AuthProvider';

const Discover = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [page, setPage] = useState(1); // Current page for pagination
  const [loadingMore, setLoadingMore] = useState(false);
  const { auth, api, refreshToken, logout } = useContext(AuthContext);

  const fetchProjectsWithNames = async (searchTerm = '', page = 1) => {
    try {
      const response = await api.get(`http://127.0.0.1:8000/api/projects/?search=${searchTerm}&page=${page}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const departmentsResponse = await api.get(`http://127.0.0.1:8000/api/departments/`);
      const departments = departmentsResponse.data;

      const projectsWithNames = await Promise.all(response.data.map(async (project) => {
        const studentDetails = project.student_id ? await getUserDetails(project.student_id, 'students') : { name: 'N/A', regNo: 'N/A' };
        const supervisorDetails = project.supervisor_id ? await getUserDetails(project.supervisor_id, 'supervisors') : { name: 'N/A', regNo: 'N/A' };
        const collaboratorsDetails = await Promise.all(
          project.collaborators.map(async (collaborator) => await getUserDetails(collaborator, 'students'))
        );

        const department = departments.find(dpt => dpt.dpt_id === project.department_id);
        const department_name = department ? department.dpt_name : 'Not assigned';

        return {
          ...project,
          student_name: studentDetails.name,
          student_reg: studentDetails.regNo,
          supervisor_name: supervisorDetails.name,
          supervisor_reg: supervisorDetails.regNo,
          department_name: department_name,
          collaborators: collaboratorsDetails.map(collaborator => ({
            name: collaborator.name,
            regNo: collaborator.regNo,
          })),
        };
      }));

      const completedProjects = projectsWithNames.filter(project => project.completion_status === true);
      setProjects(prev => (page > 1 ? [...prev, ...completedProjects] : completedProjects)); // Handle pagination
      setFilteredProjects(prev => (page > 1 ? [...prev, ...completedProjects] : completedProjects)); // Filtered projects for pagination
      setLoadingMore(false);
    } catch (error) {
      console.log('Error fetching projects:', error);
    }
  };

  const getUserDetails = async (id, userType) => {
    try {
      const response = await api.get(`http://127.0.0.1:8000/api/${userType}/${id}/`);
      return {
        name: `${response.data.fname} ${response.data.lname}`,
        regNo: response.data.reg_no || response.data.reg_num,
      };
    } catch (error) {
      console.error(`Error fetching ${userType} details:`, error);
      return { name: 'N/A', regNo: 'N/A' };
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value?.toLowerCase();
    setSearchTerm(term);
    setPage(1); // Reset page to 1 for a new search
    fetchProjectsWithNames(term, 1); // Fetch projects with the search term
  };

  const loadMoreProjects = () => {
    setLoadingMore(true);
    setPage(prev => prev + 1); // Increase page number
    fetchProjectsWithNames(searchTerm, page + 1); // Fetch next page
  };

  useEffect(() => {
    if (auth.accessToken) {
      fetchProjectsWithNames();
    } else {
      let tries = 0;
      while (tries < 2) {
        refreshToken()
          .then(fetchProjectsWithNames)
          .catch(error => {
            console.log('Token refresh failed:', error);
            logout();
          });
        tries++;
      }
    }
  }, [auth.accessToken, api, refreshToken, logout]);

  return (
    <div className="discover-container">
      <h2>Completed Project Archives</h2> {/* Add header/title */}

      <input
        type="text"
        placeholder="Search projects..."
        className="form-control mb-3"
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {filteredProjects.length > 0 ? (
        <>
          {filteredProjects.map((project, index) => (
            <div key={index} className="project-card">
              <h3>{project.title}</h3>
              <p><strong>Case Study:</strong> {project.case_study}</p>
              <p>{project.abstract.length > 65 ? `${project.abstract.substring(0, 65)}...` : project.abstract}</p>
              <p><strong>Student:</strong> {project.student_name}</p>
              <p><strong>Supervisor:</strong> {project.supervisor_name}</p>
              <p><strong>Department:</strong> {project.department_name}</p>

              {project.collaborators && project.collaborators.length > 0 && (
                <p><strong>Collaborators:</strong> {project.collaborators.map((collab, index) => (
                  <span key={index}>
                    {collab.name} (Reg No: {collab.regNo}){index < project.collaborators.length - 1 && ', '}
                  </span>
                ))}</p>
              )}

              <Link to={`/projects/${project.project_id}`} className="btn btn-info">Read Project</Link>
            </div>
          ))}

          {/* Pagination - Load More Button */}
          {filteredProjects.length >= 24 && (
            <button className="btn btn-primary" onClick={loadMoreProjects} disabled={loadingMore}>
              {loadingMore ? 'Loading...' : 'Load More'}
            </button>
          )}
        </>
      ) : (
        <p>No projects found.</p>
      )}
    </div>
  );
};

export default Discover;
