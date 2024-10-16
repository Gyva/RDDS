import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthProvider';
import { useParams } from 'react-router-dom';
import './StudentAssignedProject.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const StudentAssignedProject = () => {
  const { regno } = useParams();
  const { auth, api } = useContext(AuthContext);
  const [studentId, setStudentId] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchStudentAndProjects = async () => {
      try {
        if (!regno) {
          setError("User is not authenticated.");
          setLoading(false);
          return;
        }

        const studentsResponse = await api.get('http://127.0.0.1:8000/api/students/');
        const students = studentsResponse.data;
        const student = students.find(s => s.reg_no.toUpperCase() === regno.toUpperCase());

        if (student) {
          setStudentId(student.st_id);

          const projectsResponse = await api.get('http://127.0.0.1:8000/api/projects/');
          const allProjects = projectsResponse.data;

          const filteredProjects = allProjects.filter(project => 
            project.student_id === student.st_id || 
            project.collaborators?.includes(student.st_id)
          );

          setUserProjects(filteredProjects);
        } else {
          setError('Student not found.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentAndProjects();
  }, [regno, auth, api]);

  const handleShowFeedback = async (projectId) => {
    try {
      const response = await api.get(`http://127.0.0.1:8000/api/projects/${projectId}/feedback/`);
      const feedbackData = response.data;

      if (feedbackData.length > 0) {
        setFeedback(feedbackData);
        setShowModal(true);
      } else {
        setFeedback(null);
      }
    } catch (err) {
      console.error('Error fetching feedback:', err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFeedback(null);
  };

  if (loading) {
    return <p>Loading projects...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="student-projects">
      <h2>Projects Assigned to You</h2>
      {userProjects.length === 0 ? (
        <p>No projects assigned to you.</p>
      ) : (
        <div className="projects-container">
          {userProjects.map((project) => (
            <div key={project.id} className="project-card card col-12">
              <div className="card-body">
                <h5 className="card-title">{project.title}</h5>
                <p className="card-text">Case Study: {project.case_study}</p>
                <p className="card-text">Status: {project.approval_status}</p>
                <p className="card-text">Completion: {project.completion_status ? 'Completed' : 'Pending'}</p>
                <Link to={`/projects/${project.project_id}`} className="btn btn-info">View Details</Link>

                {/* Feedback button (conditionally displayed) */}
                <button
                  className="btn btn-warning ml-2"
                  onClick={() => handleShowFeedback(project.project_id)}
                >
                  View Feedback
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Feedback Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Project Feedback</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                {feedback ? (
                  feedback.map((fb) => (
                    <div key={fb.id}>
                      <p>{fb.feedback_text}</p>
                      <small>Provided by user {fb.user} on {new Date(fb.created_at).toLocaleDateString()}</small>
                    </div>
                  ))
                ) : (
                  <p>No feedback available for this project.</p>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAssignedProject;
