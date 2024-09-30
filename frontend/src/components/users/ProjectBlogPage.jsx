import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthProvider';
import './ProjectBlogPage.css'; // Import the custom CSS for styling

const ProjectBlogPage = () => {
  const { id } = useParams(); // Get project ID from URL
  const [project, setProject] = useState(null);
  const { api } = useContext(AuthContext);
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`http://127.0.0.1:8000/api/projects/${id}/`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setProject(response.data);
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchProject();
  }, [id, api]);

  const handleImprove = () => {
    // Logic for improving the project
    console.log('Improve this project');
  };

  const handleReject = () => {
    // Logic for rejecting the project
    console.log('Reject this project');
  };

  const handleApprove = () => {
    // Logic for approving the project
    console.log('Approve this project');
  };

  const handleFeedback = () => {
    // Logic for giving feedback on the project
    console.log('Give feedback on this project');
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="container mt-5" style={{paddingBottom:'100px'}}>
      <div className="row">
        <div className="col-lg-5 mb-4">
          <div className="thumbnail">
            <img
              src="https://cdn.pixabay.com/photo/2015/03/17/02/01/cubes-677092_1280.png"
              alt="Thumbnail"
              className="img-fluid"
            />
          </div>
        </div>
        <div className="col-lg-7">
          <div className="info-box d-flex flex-column p-4 justify-content-center">
            <h5 className="mb-3">{project.title}</h5>
            <span><strong>Case Study:</strong> {project.case_study}</span>
            <span><strong>Student:</strong> {project.student_name}</span>
            <span><strong>Supervisor:</strong> {project.supervisor_name}</span>
          </div>
        </div>
      </div>
      <hr className="text-secondary my-4" />
      <div className="row">
        <div className="col-lg-10 mx-auto project-description">
          <h5><strong>Abstract:</strong></h5>
          <p>{project.abstract}</p>
        </div>
      </div>
      <div className="d-flex justify-content-end col-lg-10 mx-auto mt-3 action-buttons">
        <button className="btn btn-primary" onClick={handleImprove}>Improve this project</button>
        <button className="btn btn-danger" onClick={handleReject}>Reject this project</button>
        <button className="btn btn-success" onClick={handleApprove}>Approve this project</button>
        <button className="btn btn-info" onClick={handleFeedback}>Give feedback on this project</button>
      </div>
    </div>
  );
};

export default ProjectBlogPage;
