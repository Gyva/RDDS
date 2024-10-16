import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { AuthContext } from '../contexts/AuthProvider';
import './ProjectBlogPage.css';
import axios from 'axios';
import { getAcademicYear } from '../utils/getAcademicYear';

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
  const [projectStudentInfo, setProjectStudentInfo] = useState(null)
  const [projectSupervisorInfo, setProjectSupervisorInfo] = useState(null)
  const [dissertationFile, setDissertationFile] = useState(null)
  const navigate = useNavigate();

  //for upload modal
  const [file, setFile] = useState(null); // State to store the uploaded file
  const [uploadMessage, setUploadMessage] = useState(''); // To store any response message from the API
  const [showModal, setShowModal] = useState(false);

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


        //fetching the info about the student on this project
        if (response.data.student_id !== null) {
          const student = await axios.get(`http://127.0.0.1:8000/api/students/${response.data.student_id}`)
          setProjectStudentInfo(student.data)
          console.log(student.data)
        }
        //fetching the info about the supervisor on this project
        if (response.data.supervisor_id !== null) {
          const supervisor = await axios.get(`http://127.0.0.1:8000/api/supervisors/${response.data.supervisor_id}`)
          setProjectSupervisorInfo(supervisor.data)
          console.log("supervisor on this project: " + supervisor.data)
        }

        if (response.data.completion_status === true) {
          const projectsFiles = await api.get("http://127.0.0.1:8000/api/project-files/");
          console.log("this => ", projectsFiles.data);

          // Check if id and projectFile.project are integers and compare
          console.log("id:", id);
          const fileData = projectsFiles.data.find((projectFile) => {
            console.log("projectFile.project:", projectFile.project, typeof projectFile.project);
            return projectFile.project === parseInt(id); // Ensure both are integers
          });
          // for collaborators retrieve

          const collaboratorsDetails = await Promise.all(
            response.data.collaborators.map((collaborator) =>  getUserDetails(collaborator, 'students'))
          );
          console.log("Coolb details ", collaboratorsDetails)

          setProject((prevProject) => ({
            ...prevProject,
            collaborators: collaboratorsDetails.map(collaborator => ({
              name: collaborator.name,
              regNo: collaborator.regNo,
            })),
          }));

          setDissertationFile(fileData?.file);
          console.log("fileData:", fileData);

        }


      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchProject();
  }, [api, id]);

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

  const handleUpdateContent = async () => {
    setUpdatedTitle(project.title)
    setUpdatedCaseStudy(project.case_study)
    setUpdatedAbstract(project.abstract)
  }
  const handleImproveContent = async () => {
    setUpdatedTitle(project.title)
    setUpdatedCaseStudy(project.case_study)
  }


  const handleApproveSubmit = async (e) => {
    e.preventDefault();
    const requestBody = {};

    try {
      // Assign missing student
      if (!project.student_id && selectedStudent) {
        requestBody.student_id = selectedStudent;
        await api.post(`http://127.0.0.1:8000/api/projects/${id}/assign-student/`, requestBody, {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Assign missing supervisor
      if (!project.supervisor_id && selectedSupervisor) {
        requestBody.supervisor_id = selectedSupervisor;
        const response = await api.patch(`http://127.0.0.1:8000/api/projects/${id}/`, requestBody, {
          headers: { 'Content-Type': 'application/json' },
        });


      }

      // Now approve the project
      await handleApprovalChange('Approved');

      window.$('#approveModal').modal('hide');
    } catch (error) {
      console.error('Error during approval:', error);
      alert('Error during approval process.');
    }
  };


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
    let err_or = null
    try {
      const response = await api.patch(`http://127.0.0.1:8000/api/projects/${id}/change-approval-status/`, {
        approval_status: status,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      err_or = response.data.detail
      if (response.data.detail !== null) {
        alert(response.data.detail)
      }
      alert(response.data.message);
      setProject({ ...project, approval_status: status });
    } catch (error) {
      console.error('Error changing approval status:', error);
      alert(err_or);
    }


  };

  // Assign supervisor or student
  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestBody = {};
      if (selectedSupervisor) {
        requestBody.supervisor_id = selectedSupervisor;
        const response = await api.post(`http://127.0.0.1:8000/api/project/${id}/assign_supervisor/`, requestBody, {
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
        else {
          alert(response.data.error)
        }
      }


    } catch (error) {
      console.error('Error assigning users:', error);
      alert('Error assigning supervisor/student.');
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
      const response = await api.put(`http://127.0.0.1:8000/api/projects/${id}/update_project/`, {
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
      console.error('Error updating project:', error.message);
      alert('Error updating project.', error.message);
    }
  };

  // Handle request for project improvement
  const handleImproveProject = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`http://127.0.0.1:8000/api/projects/${id}/improve-project/`, {
        title: updatedTitle,
        case_study: updatedCaseStudy,
        abstract: updatedAbstract,
        accademic_year: getAcademicYear(),
        collaborators: []
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert('Project updated successfully.');
      setProject(response.data);
      window.$('#improveModal').modal('hide');
    } catch (error) {
      console.error('Error improving project:', error);
      alert('Error submit the form data. Try again?', error);
    }
  };

  const canModifyProject = project?.approval_status === 'Pending' && (
    project.student_id === auth.id || project.supervisor_id === auth.id
  );



  //for upload



  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Set the selected file to state
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append('file', file); // Add the file to the form data

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/project-files/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadMessage('File uploaded successfully!');
      setFile(null); // Clear the file input
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadMessage('Failed to upload file. Please try again.');
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setUploadMessage(''); // Reset message on modal close
  };

  const loadDissertationContent = () => {
    console.log("dissertation is: ", dissertationFile);
    if (dissertationFile !== null) {
      // Redirect to PDF viewer route
      navigate(`/view-pdf`, {state:{fileUrl:`${encodeURIComponent(dissertationFile)}`}});
    } else {
      alert('No file available to view.');
    }
  }



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
                <span><strong>Student(s):</strong> {assignedStudent ? `${assignedStudent.fname} ${assignedStudent.lname} ( Reg No: ${assignedStudent.reg_no})`
                
                
                : 'Not assigned'} {project.collaborators && project.collaborators.length > 0 && (
                  project.collaborators.map((collab, index) => (
                   <span key={index}>
                     {console.log("bbbb ",collab.name)}
                     {", "+collab.name} (Reg No: {collab.regNo}){index < project.collaborators.length - 1 && ', '}
                   </span>
                 ))
               )}</span>
                {console.log("Collab ",project.collaborators)}
                
                <span><strong>Department:</strong> {departmentName}</span>
                <span><strong>AI Check:</strong> {project.check_status?.toString()}</span>
                <span><strong>Supervisor:</strong> {assignedSupervisor ? `${assignedSupervisor.fname} ${assignedSupervisor.lname} ( Reg No: ${assignedSupervisor.reg_num})` : 'Not assigned'}</span>
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
          {project.approval_status === 'Pending' && project.completion_status !== true && (project.student_id || project.supervisor_id) && (auth.role.toUpperCase() === 'HOD') && (
            <button className="btn btn-success ml-2" data-toggle="modal" data-target="#approveModal">
              Approve
            </button>
          )}
          {project.approval_status === 'Pending' && project.completion_status !== true && (project.student_id || project.supervisor_id) && (auth.role.toUpperCase() === 'HOD') && (
            <button className="btn btn-danger ml-2" onClick={() => handleApprovalChange('Reject')}>
              Delete
            </button>
          )}

          {project.approval_status === 'Pending' && project.completion_status !== true && (project.student_id || project.supervisor_id) && (auth.role.toUpperCase() === 'HOD') && (
            <button className="btn btn-info ml-2" data-toggle="modal" data-target="#feedbackModal">
              Give Feedback
            </button>
          )}
          {project.approval_status === 'Pending' && project.completion_status !== true && (project.student_id || project.supervisor_id) && (auth.role.toUpperCase() === 'HOD') && (
            <button className="btn btn-info ml-2" data-toggle="modal" data-target="#addCollaboratorModal">
              Add Collaborator
            </button>
          )}
          {project.approval_status === 'Pending' && project.completion_status !== true && (project.student_id || project.supervisor_id) && (projectStudentInfo?.reg_no.toUpperCase() === auth.user.toUpperCase() || projectSupervisorInfo?.reg_num.toUpperCase() === auth.user.toUpperCase()) && (
            <button className="btn btn-info ml-2" onClick={handleUpdateContent} data-toggle="modal" data-target="#updateModal">
              Update This Project
            </button>
          )}
          {canModifyProject && project.completion_status !== true && (
            <div className="text-center mt-4">
              <button className="btn btn-danger" onClick={handleDeleteProject}>
                Delete Project
              </button>
            </div>
          )}
          {project.completion_status === true && (project.student_id || project.supervisor_id) && (auth.role.toUpperCase() === 'STUDENT' || auth.role.toUpperCase() === 'SUPERVISOR' || auth.role.toUpperCase() === 'HOD') && (
            <button className="btn btn-info ml-2" onClick={handleImproveContent} data-toggle="modal" data-target="#improveModal">
              Request Improvement On This Project
            </button>
          )}
          {dissertationFile === null && project.completion_status === true && (projectStudentInfo?.reg_no.toUpperCase() === auth.user.toUpperCase()) && (
            <button className="btn btn-info ml-2" onClick={handleUpdateContent} data-toggle="modal" data-target="#upldModal">
              Upload project dissertation
            </button>
          )}
          {project.completion_status === true && dissertationFile !== null && (projectStudentInfo?.reg_no.toUpperCase() === auth.user.toUpperCase()) && (
            <button className="btn btn-info ml-2" onClick={loadDissertationContent}>
              View Project Dissertation
            </button>
          )}
        </div>
      </div>
      {/* Approve Modal */}
      <div className="modal fade" id="approveModal" tabIndex="-1" role="dialog" aria-labelledby="approveModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-xl" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="approveModalLabel">Approve Project</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleApproveSubmit}>
                {/* Check if the project has a student */}
                {!project.student_id && (
                  <div className="form-group">
                    <label htmlFor="studentSelect">Assign Student</label>
                    <select
                      className="form-control"
                      id="studentSelect"
                      value={selectedStudent || ''}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                      required
                    >
                      <option value="">Select Student</option>
                      {departmentStudents.map(student => (
                        <option key={student.st_id} value={student.st_id}>
                          {student.fname} {student.lname}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Check if the project has a supervisor */}
                {!project.supervisor_id && (
                  <div className="form-group">
                    <label htmlFor="supervisorSelect">Assign Supervisor</label>
                    <select
                      className="form-control"
                      id="supervisorSelect"
                      value={selectedSupervisor || ''}
                      onChange={(e) => setSelectedSupervisor(e.target.value)}
                      required
                    >
                      <option value="">Select Supervisor</option>
                      {departmentSupervisors.map(supervisor => (
                        <option key={supervisor.sup_id} value={supervisor.sup_id}>
                          {supervisor.fname} {supervisor.lname}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button type="submit" className="btn btn-primary">
                  Assign and Approve
                </button>
              </form>
            </div>
          </div>
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
      {/* improve project Modal */}
      <div className="modal fade" id="improveModal" tabIndex="-1" role="dialog" aria-labelledby="improveModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="improveModalLabel">Request Project Improvements</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleImproveProject}>
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
                  <label htmlFor="updatedAbstract"> Your Abstract</label>
                  <ReactQuill
                    theme="snow"
                    onChange={setUpdatedAbstract}
                  />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
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

      {/* upload modal */}
      <div
        className={`modal fade`}
        id="upldModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="uploadModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="uploadModalLabel">Upload File for Project</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={handleClose}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => { e.preventDefault(); handleUpload(); }}>
                <div className="form-group">
                  <label htmlFor="fileInput">Choose file</label>
                  <input
                    type="file"
                    className="form-control"
                    id="fileInput"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt"
                    required
                  />
                </div>
                {uploadMessage && <p className="text-success">{uploadMessage}</p>}
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>




    </div>
  );
};

export default ProjectBlogPage;
