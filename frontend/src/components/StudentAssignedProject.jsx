import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthProvider';

const StudentAssignedProject = () => {
  const { auth, api } = useContext(AuthContext);
  const [studentId, setStudentId] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentAndProjects = async () => {
      try {
        // Ensure auth.user is available before proceeding
        if (!auth || !auth.user) {
          setError("User is not authenticated.");
          setLoading(false);
          return;
        }

        // Step 1: Fetch all students
        const studentsResponse = await api.get('http://127.0.0.1:8000/api/students/');
        const students = studentsResponse.data;
        console.log('Fetched students:', students);

        // Step 2: Find the student that matches auth.user (by reg_no)
        const regNumber = auth.user.toUpperCase(); // Ensure consistency in comparison
        console.log('Current auth.user (reg_no):', regNumber);

        const student = students.find(s => s.reg_no.toUpperCase() === regNumber);

        if (student) {
          // Step 3: Capture the student ID (st_id)
          setStudentId(student.st_id);

          // Step 4: Fetch all projects
          const projectsResponse = await api.get('http://127.0.0.1:8000/api/projects/');
          const allProjects = projectsResponse.data;

          // Step 5: Filter projects that belong to this student
          const filteredProjects = allProjects.filter(project => project.student_id === student.st_id);

          // Step 6: Set the filtered projects in the state
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
  }, [auth, api]);  // Ensure auth and api are dependencies

  if (loading) {
    return <p>Loading projects...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Projects Assigned to You</h2>
      {userProjects.length === 0 ? (
        <p>No projects assigned to you.</p>
      ) : (
        <ul className="list-group">
          {userProjects.map((project) => (
            <li key={project.id} className="list-group-item">
              <h5>{project.title}</h5>
              <p>Case Study: {project.case_study}</p>
              <p>Status: {project.approval_status}</p>
              <p>Completion: {project.completion_status ? 'Completed' : 'Pending'}</p>
              {/* Add more project details or buttons here */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentAssignedProject;
