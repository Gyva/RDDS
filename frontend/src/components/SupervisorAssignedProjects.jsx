import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthProvider';
import { useParams } from 'react-router-dom';
import './SupervisorAssignedProjects.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const SupervisorAssignedProjects = () => {
  const { regno } = useParams(); // You might want to adapt this if supervisors don't have registration numbers
  const { auth, api } = useContext(AuthContext);
  const [supervisorId, setSupervisorId] = useState(null);
  const [approvedProjects, setApprovedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // State for success/error messages

  useEffect(() => {
    const fetchSupervisorAndProjects = async () => {
      try {
        const supervisorsResponse = await api.get('http://127.0.0.1:8000/api/supervisors/');
        const supervisors = supervisorsResponse.data;
        const supervisor = supervisors.find(s => s.reg_num.toUpperCase() === regno.toUpperCase());

        if (supervisor) {
          setSupervisorId(supervisor.sup_id);

          const projectsResponse = await api.get('http://127.0.0.1:8000/api/projects/');
          const allProjects = projectsResponse.data;

          const filteredProjects = allProjects.filter(project => 
            project.supervisor_id === supervisor.sup_id && project.approval_status === 'Approved'
          );

          setApprovedProjects(filteredProjects);
        } else {
          setError('Supervisor not found.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSupervisorAndProjects();
  }, [auth, api, regno]);

  const handleMarkComplete = async (projectId) => {
    try {
      await api.patch(`http://127.0.0.1:8000/api/projects/${projectId}/mark-completed/`);
      // After marking as complete, you might want to refresh the project list
      
      setApprovedProjects(prevProjects => 
        prevProjects.map(project => 
          project.project_id === projectId ? { ...project, completion_status: true } : project
        )
      );
      setMessage('Project marked as complete successfully!'); // Set success message
    } catch (err) {
      console.error('Error marking project as complete:', err);
      setMessage('Error marking project as complete. Please try again.'); // Set error message
    }
  };

  if (loading) {
    return <p>Loading projects...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="supervisor-projects ms-5">
      <h3>Approved Projects Brought to You..</h3>
      
      {/* Display message if available */}
      {message && <div className="alert alert-info">{message}</div>}

      {approvedProjects.length === 0 ? (
        <p>No approved projects assigned to you.</p>
      ) : (
        <div className="projects-container">
          {approvedProjects.map((project) => (
            <div key={project.id} className="project-card card col-12">
              <div className="card-body">
                <h5 className="card-title">{project.title}</h5>
                <p className="card-text">Case Study: {project.case_study}</p>
                <p className="card-text">Status: {project.approval_status}</p>
                <p className="card-text">Completion: {project.completion_status ? 'Completed' : 'Pending'}</p>
                
                {/* View Details Button */}
                <Link to={`/projects/${project.project_id}`} className="btn btn-info">View Details</Link>

                {/* Mark Complete Button */}
                {!project.completion_status && (
                  <button
                    className="btn btn-success ml-2"
                    onClick={() => handleMarkComplete(project.project_id)}
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupervisorAssignedProjects;
