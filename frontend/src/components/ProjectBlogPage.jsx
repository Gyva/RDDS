import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthProvider';
import './ProjectBlogPage.css'; // Import the custom CSS for styling

const ProjectBlogPage = () => {
  const { id } = useParams(); // Get project ID from URL
  const [project, setProject] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const { api } = useContext(AuthContext);

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

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`http://127.0.0.1:8000/api/projects/${id}/feedback/`, {
        feedback_text: feedbackText,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert(response.data.message);
      setFeedbackText(''); // Reset feedback text
      window.$('#feedbackModal').modal('hide'); // Close modal
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback.');
    }
  };

  const handleApprovalChange = async (status) => {
    try {
      const response = await api.patch(`http://127.0.0.1:8000/api/projects/${id}/change-approval-status/`, {
        approval_status: status,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert(response.data.message);
      // Optionally, refresh project data or update the UI based on the response
      const updatedProject = { ...project, approval_status: status }; // Update the local state
      setProject(updatedProject);
    } catch (error) {
      console.error('Error changing approval status:', error);
      alert('Error changing approval status.');
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="container mt-5" style={{ paddingBottom: '100px' }}>
      <div className="row">
        <div className="col-lg-10 mx-auto">
          <div className="info-box d-flex flex-column p-4 justify-content-center">
            <h5 className="mb-3">{project.title}</h5>
            <span><strong>Case Study:</strong> {project.case_study}</span>
            <span><strong>Student:</strong> {project.student_name}</span>
            <span><strong>Supervisor:</strong> {project.supervisor_name}</span>
            <span><strong>Approval Status:</strong> {project.approval_status}</span>
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
        <button className="btn btn-primary" onClick={() => handleApprovalChange('Needs Improvement')}>Improve this project</button>
        <button className="btn btn-danger" onClick={() => handleApprovalChange('Rejected')}>Reject this project</button>
        <button className="btn btn-success" onClick={() => handleApprovalChange('Approved')}>Approve this project</button>
        <button className="btn btn-info" data-toggle="modal" data-target="#feedbackModal">Give feedback on this project</button>
      </div>

      {/* Feedback Modal */}
      <div className="modal fade" id="feedbackModal" tabIndex="-1" role="dialog" aria-labelledby="feedbackModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="feedbackModalLabel">Give feedback to this Project</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleFeedbackSubmit}>
                <div className="form-group">
                  <label htmlFor="feedbackText">Feedback</label>
                  <textarea
                    id="feedbackText"
                    className="form-control"
                    rows="3"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Submit Feedback</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectBlogPage;
