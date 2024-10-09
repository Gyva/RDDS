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
  const [improvedAbstract, setImprovedAbstract] = useState('');

  const [departmentSupervisors, setDepartmentSupervisors] = useState([]);
  const [departmentStudents, setDepartmentStudents] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [unassignSupervisor, setUnassignSupervisor] = useState(false);
  const [unassignStudent, setUnassignStudent] = useState(false);
  const { api, auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`http://127.0.0.1:8000/api/projects/${id}/`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setProject(response.data);

        console.log(response.data);

        if (response.data.student !== null && response.data.supervisor !== null && response.data.approval_status !== 'Rejected') {
          const statusToBe = 'Approved'
          const response = await api.patch(`http://127.0.0.1:8000/api/projects/${id}/change-approval-status/`, {
            approval_status: statusToBe,
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          alert(response.data.message);
          setProject({ ...project, approval_status: statusToBe });
        }
        if (response.data.student === null || response.data.supervisor === null && response.data.approval_status !== 'Rejected') {
          const statusToBe = 'Pending'
          const response = await api.patch(`http://127.0.0.1:8000/api/projects/${id}/change-approval-status/`, {
            approval_status: statusToBe,
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          alert(response.data.message);
          setProject({ ...project, approval_status: statusToBe });
        }

        // fetch department supervisors


        const response2 = await axios.get(`http://127.0.0.1:8000/api/supervisors/?dpt_id=${response.data.department}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setDepartmentSupervisors(response2.data);



        const response3 = await axios.get(`http://127.0.0.1:8000/api/students/?dpt_id=${response.data.department}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        setDepartmentStudents(response3.data)




      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    // const fetchDepartmentSupervisors = async () => {
    //   try {
    //     const response = await axios.get(`http://127.0.0.1:8000/api/supervisors/?dpt_id=${project.department}`, {
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //     });

    //     setDepartmentSupervisors(response.data);
    //     console.log(response.data)
    //   } catch (error) {
    //     console.error('Error fetching users:', error);
    //   }
    // };

    fetchProject();


  }, []);

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
  //Fecthing the supervisors available in  current department

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
      // Create the request body dynamically
      const requestBody = {};

      // Conditionally add the supervisor if selected
      if (selectedSupervisor) {
        requestBody.supervisor = selectedSupervisor;
      }

      // Conditionally add the student if selected
      if (selectedStudent) {
        requestBody.student = selectedStudent;
      }

      // Make the API request with the dynamically built request body
      const response = await api.patch(`http://127.0.0.1:8000/api/projects/${id}/`, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      alert("Assignement succefully done");
      setProject(response.data);
      const response2 = await api.post('http://127.0.0.1:8000/api/conversations/', {
        project_id: response.data.project_id
        });
        
      // if(response.data.student !== null){
      //   const response3 = await api.get(`http://127.0.0.1:8000/api/students/${response.data.student}/`);        
      //   const response4 = await api.post(`http://127.0.0.1:8000/api/conversation-participants/`,{
          
      //   })
      // }

      // Hide the modal after successful assignment
      window.$('#assignModal').modal('hide');
    } catch (error) {
      console.error('Error assigning users:', error);
      alert('Error assigning supervisor/student.');
    }

  };

  // Handle unassign logic submission
  const handleUnassignSubmit = async (e) => {
    e.preventDefault();
    const updatedProject = {};

    if (unassignSupervisor) {
      updatedProject.supervisor = null;
    }
    if (unassignStudent) {
      updatedProject.student = null;
    }

    try {
      const response = await api.patch(`http://127.0.0.1:8000/api/projects/${id}/`, updatedProject, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert("Un-assignment successfully done.");
      setProject(response.data);
      setUnassignSupervisor(false);
      setUnassignStudent(false);
      window.$('#unassignModal').modal('hide');
    } catch (error) {
      console.error('Error unassigning users:', error);
      alert('Error unassigning supervisor/student.');
    }
  };

  // Show assign button if either supervisor or student is not assigned
  const showAssignButton = () => {
    return !project.supervisor || !project.student;
  };

  // Show unassign button if both supervisor and student are assigned
  const showUnassignButton = () => {
    return project.supervisor && project.student;
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="container mt-5" style={{ paddingBottom: '100px' }}>
      <div className="row">
        <div className="col-lg-10 mx-auto">
          <div className="info-box d-flex flex-column p-4 justify-content-center">
            <h5 className="mb-3">{project.title}</h5>
            <span><strong>Case Study:</strong> {project.case_study}</span>
            <span><strong>Student:</strong> {project.student || 'Not assigned'}</span>
            <span><strong>Supervisor:</strong> {project.supervisor || 'Not assigned'}</span>
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
        {!(project.student && project.supervisor) && (
          <button className="btn btn-primary" data-toggle="modal" data-target="#assignModal">
            {project.supervisor ? 'Assign Student' : 'Assign Supervisor'}
          </button>
        )}

        {showUnassignButton() && (
          <button className="btn btn-warning" data-toggle="modal" data-target="#unassignModal">
            Unassign
          </button>
        )}
        {project.approval_status !== 'Approved' && (project.student && project.supervisor) && (<button className="btn btn-success ml-2" data-toggle="modal" data-target="#assignModal"  /*onClick={() => handleApprovalChange('Approved')}*/>
          Approve
        </button>)}
        {project.approval_status !== 'Approved' && (project.student && project.supervisor) && (
          <button className="btn btn-danger ml-2" onClick={() => handleApprovalChange('Rejected')}>
            Reject
          </button>
        )}

        {project.approval_status === 'Pending' && (project.student && project.supervisor) && (<button className="btn btn-info ml-2" data-toggle="modal" data-target="#feedbackModal">
          Give Feedback
        </button>)}

      </div>
      {console.log(departmentSupervisors)}
      {/* Assign Modal */}
      <div className="modal fade" id="assignModal" tabIndex="-1" aria-labelledby="assignModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="assignModalLabel">Assign Supervisor/Student</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAssignSubmit}>
                {!project.supervisor && (
                  <div className="form-group">
                    <label htmlFor="supervisorSelect">Assign Supervisor</label>
                    <select
                      className="form-control"
                      id="supervisorSelect"
                      value={selectedSupervisor}
                      onChange={(e) => setSelectedSupervisor(e.target.value)}
                    >
                      <option value="">Select Supervisor</option>
                      {departmentSupervisors?.map((supervisor) => (

                        <option key={supervisor.sup_id} value={supervisor.sup_id}>
                          {supervisor.reg_num + " | " + supervisor.fname + " " + supervisor.lname}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {!project.student && (
                  <div className="form-group">
                    <label htmlFor="studentSelect">Assign Student</label>
                    <select
                      className="form-control"
                      id="studentSelect"
                      value={selectedStudent}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                    >
                      <option value="">Select Student</option>
                      {departmentStudents.map((student) => (
                        <option key={student.st_id} value={student.st_id}>
                          {student.reg_no + " " + student.fname + " " + student.lname}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <button type="submit" className="btn btn-primary">Assign</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Unassign Modal */}
      <div className="modal fade" id="unassignModal" tabIndex="-1" aria-labelledby="unassignModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="unassignModalLabel">Unassign Supervisor/Student</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUnassignSubmit}>
                <div className="form-group">
                  {project.supervisor && (
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="unassignSupervisor"
                        checked={unassignSupervisor}
                        onChange={() => setUnassignSupervisor(!unassignSupervisor)}
                      />
                      <label className="form-check-label" htmlFor="unassignSupervisor">
                        Unassign Supervisor ({project.supervisor.name})
                      </label>
                    </div>
                  )}
                </div>
                <div className="form-group">
                  {project.student && (
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="unassignStudent"
                        checked={unassignStudent}
                        onChange={() => setUnassignStudent(!unassignStudent)}
                      />
                      <label className="form-check-label" htmlFor="unassignStudent">
                        Unassign Student ({project.student.name})
                      </label>
                    </div>
                  )}
                </div>
                <button type="submit" className="btn btn-warning">Unassign</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <div className="modal fade" id="feedbackModal" tabIndex="-1" aria-labelledby="feedbackModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="feedbackModalLabel">Give Feedback</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleFeedbackSubmit}>
                <div className="form-group">
                  <label htmlFor="feedbackText">Feedback</label>
                  <ReactQuill
                    theme="snow"
                    value={feedbackText}
                    onChange={setFeedbackText}
                    placeholder="Write your feedback here..."
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
