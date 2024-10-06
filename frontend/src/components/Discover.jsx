import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './Discover.css'; 
import { AuthContext } from '../contexts/AuthProvider'; 

const Discover = () => {
  const [projects, setProjects] = useState([]);
  const { auth, api, refreshToken } = useContext(AuthContext); // Destructure refreshToken function

  const fetchProjects = async () => {
    try {
      // Ensure the access token is present
      if (!auth.accessToken) {
        await refreshToken(); // Trigger token refresh if needed
      }

      // Fetch the projects with the refreshed token
      const response = await api.get('http://127.0.0.1:8000/api/projects/', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setProjects(response.data);
      console.log(response.data);
    } catch (error) {
      console.log('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    if (auth.accessToken) {
      fetchProjects();
    } else {
      refreshToken() // Call refreshToken if accessToken is missing initially
        .then(fetchProjects) // After refreshing, attempt to fetch the projects
        .catch(error => console.log('Token refresh failed:', error));
    }
  }, [auth.accessToken, api, refreshToken]);

  return (
    <div className="discover-container">
      {projects.map((project, index) => (
        <div key={index} className="project-card">
          <div className="project-card-image">
            <img src="https://via.placeholder.com/150" alt="Project" />
          </div>
          <div className="project-card-content">
            <h3>{project.title}</h3>
            <p><strong>Case Study:</strong> {project.case_study}</p>
            <p>{project.abstract.length > 65 ? `${project.abstract.substring(0, 65)}...` : project.abstract}</p>
            <p><strong>Student:</strong> {project.student_name}</p> {/* Student Name */}
            <p><strong>Supervisor:</strong> {project.supervisor_name}</p> {/* Supervisor Name */}
            <Link to={`/projects/${project.project_id}`} className="btn btn-info">Read Project</Link> {/* Read Project Button */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Discover;
