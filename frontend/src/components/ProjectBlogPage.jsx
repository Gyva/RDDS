import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { AuthContext } from '../contexts/AuthProvider';
import './ProjectBlogPage.css';
import axios from 'axios';

const ProjectBlogPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedCaseStudy, setUpdatedCaseStudy] = useState('');
  const [updatedAbstract, setUpdatedAbstract] = useState('');
  const { api, auth } = useContext(AuthContext);
  const [departmentName, setDepartmentName] = useState('');
  const [students, setStudents] = useState([]);
  const [departmentSupervisors, setDepartmentSupervisors] = useState([]);
  const [departmentStudents, setDepartmentStudents] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [unassignSupervisor, setUnassignSupervisor] = useState(false);
  const [unassignStudent, setUnassignStudent] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`http://127.0.0.1:8000/api/projects/${id}/`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setProject(response.data);

        // Fetch department supervisors and students
        if (response.data.department_id !== null) {
          const [supervisorsResponse, studentsResponse] = await Promise.all([
            axios.get(`http://127.0.0.1:8000/api/supervisors/?dpt_id=${response.data.department_id}`, {
              headers: {
                'Content-Type': 'application/json',
              },
            }),
            axios.get(`http://127.0.0.1:8000/api/students/?dpt_id=${response.data.department_id}`, {
              headers: {
                'Content-Type': 'application/json',
              },
            }),
          ]);

          setDepartmentSupervisors(supervisorsResponse.data);
          setDepartmentStudents(studentsResponse.data);
        }

        // Fetch department name
        const departments = await axios.get(`http://127.0.0.1:8000/api/departments/`);
        const department = departments.data.find((dpt) => dpt.dpt_id === response.data.department_id);
        setDepartmentName(department?.dpt_name || 'Not assigned');

      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchProject();
  }, [api, id]);

  //handle add collaborator submiition
  const handleAddCollaboratorSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`http://127.0.0.1:8000/api/projects/${id}/add-collaborator/`, {
        collaborator_id: selectedCollaborator,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert(response.data.message);
      window.$('#addCollaboratorModal').modal('hide');
    } catch (error) {
      console.error('Error adding collaborator:', error);
      alert('Error adding collaborator.');
    }
  };

  // Submit feedback form
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
      setFeedbackText('');
      window.$('#feedbackModal').modal('hide');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback.');
    }
  };

  // Change approval status
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
      setProject({ ...project, approval_status: status });
    } catch (error) {
      console.error('Error changing approval status:', error);
      alert('Error changing approval status.');
    }
  };

  // Assign supervisor or student
  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestBody = {};
      if (selectedSupervisor){
        requestBody.supervisor_id = selectedSupervisor;
        const response = await api.patch(`http://127.0.0.1:8000/api/project/${id}/assign_supervisor/`, requestBody, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
          alert("Supervisor Assignment done successfully")
          setProject(response.data);
          console.log(response.data);
          window.$('#assignModal').modal('hide');
       
          alert(response.data.error)
       
  
      } 
      if (selectedStudent) {
        requestBody.student_id = selectedStudent;
      console.log(requestBody);
      const response = await api.post(`http://127.0.0.1:8000/api/projects/${id}/assign-student/`, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.data.error) {
        alert("Student Assignment done successfully")
        setProject(response.data);
        console.log(response.data);
        window.$('#assignModal').modal('hide');
      }
      else{
        alert(response.data.error)
      }
      }
      

    } catch (error) {
      console.error('Error assigning users:', error);
      alert('Error assigning supervisor/student.');
    }
  };

  // Handle unassign logic submission
  const handleUnassignSubmit = async (e) => {
    e.preventDefault();
    const updatedProject = {};
    if (unassignSupervisor) updatedProject.supervisor_id = null;
    if (unassignStudent) updatedProject.student_id = null;

    try {
      const response = await api.patch(`http://127.0.0.1:8000/api/projects/${id}/`, updatedProject, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert("Unassignment successfully done.");
      setProject(response.data);
      setUnassignSupervisor(false);
      setUnassignStudent(false);
      window.$('#unassignModal').modal('hide');
    } catch (error) {
      console.error('Error unassigning users:', error);
      alert('Error unassigning supervisor/student.');
    }
  };

  // Handle delete project
  const handleDeleteProject = async () => {
    try {
      await api.delete(`http://127.0.0.1:8000/api/projects/${id}/`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert('Project deleted successfully.');
      window.location.href = '/'; // Redirect after delete
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project.');
    }
  };

  // Handle update project
  const handleUpdateProject = async (e) => {
    e.preventDefault();
    try {
      const response = await api.patch(`http://127.0.0.1:8000/api/projects/${id}/`, {
        title: updatedTitle,
        case_study: updatedCaseStudy,
        abstract: updatedAbstract,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert('Project updated successfully.');
      setProject(response.data);
      window.$('#updateModal').modal('hide');
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Error updating project.');
    }
  };

  const canModifyProject = project?.approval_status === 'Pending' && (
    project.student_id === auth.id || project.supervisor_id === auth.id
  );

  // Show unassign button if both supervisor and student are assigned
  const showUnassignButton = () => {
    return project.supervisor_id && project.student_id;
  };

  if (!project) return <div>Loading...</div>;

  const assignedStudent = departmentStudents.find(student => student.st_id === project.student_id);
  const assignedSupervisor = departmentSupervisors.find(supervisor => supervisor.sup_id === project.supervisor_id);

  return (
    <div className="container mt-5" style={{ paddingBottom: '100px' }}>
      <div >
        <div className='d-flex flex-column mb-3'>
          <div className="row">
            <div className="mx-auto">
              <div className="info-box d-flex flex-column p-4">
                <h5 className="mb-3">{project.title}</h5>
                <span><strong>Case Study:</strong> {project.case_study}</span>
                <span><strong>Student:</strong> {assignedStudent ? `${assignedStudent.fname} ${assignedStudent.lname}` : 'Not assigned'}</span>
                <span><strong>Department:</strong> {departmentName}</span>
                <span><strong>AI Check:</strong> {project.check_status.toString()}</span>
                <span><strong>Supervisor:</strong> {assignedSupervisor ? `${assignedSupervisor.fname} ${assignedSupervisor.lname}` : 'Not assigned'}</span>
                <span><strong>Approval Status:</strong> {project.approval_status}</span>
              </div>

            </div>

            <hr className="text-secondary my-4" />
            <div className="project-description">
              <h5><strong>Abstract:</strong></h5>
              <p>{project.abstract}</p>
            </div>
          </div>
        </div>
        <div className="action-buttons">
          {!(project.student_id && project.supervisor_id) && (
            <button className="btn btn-primary" data-toggle="modal" data-target="#assignModal">
              {project.supervisor_id ? 'Assign Student' : 'Assign Supervisor'}
            </button>
          )}
          {showUnassignButton() && (
            <button className="btn btn-warning" data-toggle="modal" data-target="#unassignModal">
              Unassign
            </button>
          )}
          {project.approval_status === 'Pending' && (project.student_id || project.supervisor_id) && (
            <button className="btn btn-success ml-2" onClick={() => handleApprovalChange('Approved')}>
              Approve
            </button>
          )}
          {project.approval_status === 'Pending' && (project.student_id || project.supervisor_id) && (
            <button className="btn btn-danger ml-2" onClick={() => handleApprovalChange('Rejected')}>
              Reject
            </button>
          )}
          {project.approval_status === 'Pending' && (project.student_id || project.supervisor_id) && (
            <button className="btn btn-info ml-2" data-toggle="modal" data-target="#feedbackModal">
              Give Feedback
            </button>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      <div className="modal fade" id="feedbackModal" tabIndex="-1" role="dialog" aria-labelledby="feedbackModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="feedbackModalLabel">Feedback</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleFeedbackSubmit}>
                <div className="form-group">
                  <label htmlFor="feedbackText">Feedback</label>
                  <textarea
                    className="form-control"
                    id="feedbackText"
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

      {/* Assign Modal */}
      <div className="modal fade" id="assignModal" tabIndex="-1" role="dialog" aria-labelledby="assignModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="assignModalLabel">Assign Users</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAssignSubmit}>
                <div className="form-group">
                  <label htmlFor="supervisorSelect">Supervisor</label>
                  <select
                    className="form-control"
                    id="supervisorSelect"
                    value={selectedSupervisor || ''}
                    onChange={(e) => setSelectedSupervisor(e.target.value)}
                  >
                    <option value="">Select Supervisor</option>
                    {departmentSupervisors.map(supervisor => (
                      <option key={supervisor.sup_id} value={supervisor.sup_id}>
                        {supervisor.fname} {supervisor.lname}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="studentSelect">Student</label>
                  <select
                    className="form-control"
                    id="studentSelect"
                    value={selectedStudent || ''}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                  >
                    <option value="">Select Student</option>
                    {departmentStudents.map(student => (
                      <option key={student.st_id} value={student.st_id}>
                        {student.fname} {student.lname}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">Assign</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Unassign Modal */}
      <div className="modal fade" id="unassignModal" tabIndex="-1" role="dialog" aria-labelledby="unassignModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="unassignModalLabel">Unassign Users</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUnassignSubmit}>
                <div className="form-group">
                  <label htmlFor="unassignSupervisorCheckbox">Unassign Supervisor</label>
                  <input
                    type="checkbox"
                    id="unassignSupervisorCheckbox"
                    checked={unassignSupervisor}
                    onChange={(e) => setUnassignSupervisor(e.target.checked)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="unassignStudentCheckbox">Unassign Student</label>
                  <input
                    type="checkbox"
                    id="unassignStudentCheckbox"
                    checked={unassignStudent}
                    onChange={(e) => setUnassignStudent(e.target.checked)}
                  />
                </div>
                <button type="submit" className="btn btn-danger">Unassign</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      <div className="modal fade" id="updateModal" tabIndex="-1" role="dialog" aria-labelledby="updateModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="updateModalLabel">Update Project</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUpdateProject}>
                <div className="form-group">
                  <label htmlFor="updatedTitle">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="updatedTitle"
                    value={updatedTitle}
                    onChange={(e) => setUpdatedTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="updatedCaseStudy">Case Study</label>
                  <input
                    type="text"
                    className="form-control"
                    id="updatedCaseStudy"
                    value={updatedCaseStudy}
                    onChange={(e) => setUpdatedCaseStudy(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="updatedAbstract">Abstract</label>
                  <ReactQuill
                    theme="snow"
                    value={updatedAbstract}
                    onChange={setUpdatedAbstract}
                  />
                </div>
                <button type="submit" className="btn btn-primary">Update</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Add Collaborator Modal */}
      <div className="modal fade" id="addCollaboratorModal" tabIndex="-1" role="dialog" aria-labelledby="addCollaboratorModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addCollaboratorModalLabel">Add Collaborator</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddCollaboratorSubmit}>
                <div className="form-group">
                  <label htmlFor="collaboratorSelect">Select Collaborator</label>
                  <select
                    className="form-control"
                    id="collaboratorSelect"
                    value={selectedCollaborator || ''}
                    onChange={(e) => setSelectedCollaborator(e.target.value)}
                    required
                  >
                    <option value="">Choose Collaborator</option>
                    {departmentStudents
                      .filter(student => student.st_id !== project.student_id) // Exclude primary student
                      .map(student => (
                        <option key={student.st_id} value={student.st_id}>
                          {student.fname} {student.lname}
                        </option>
                      ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">Add Collaborator</button>
              </form>
            </div>
          </div>
        </div>
      </div>


      {/* Delete Project Button */}
      {canModifyProject && (
        <div className="text-center mt-4">
          <button className="btn btn-danger" onClick={handleDeleteProject}>
            Delete Project
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectBlogPage;
