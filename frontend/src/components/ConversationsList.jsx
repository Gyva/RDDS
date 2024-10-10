import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthProvider';
import './Conversations.css'; // Add any styling you need here

const ConversationsList = () => {
    const navigate = useNavigate()
    const [students,setStudents] = useState()
    const [supervisors, setSupervisors] = useState() 
  const { auth, api } = useContext(AuthContext); // Use the authenticated user
  const [conversations, setConversations] = useState([]);

  // Fetch all conversations for the supervisor/HoD
  const fetchConversations = async () => {
    try {
      const url = `http://127.0.0.1:8000/api/conversations/?participant_id=${auth.id}`; // Adjust the API route accordingly
      const response = await api.get(url);
      setConversations(response.data); // Set conversations data
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  };
  const handleChatClick = async () => {
    try {
      let studentId,supervisorId, projectId, conversationId;

      // Check user role and fetch the necessary IDs
      if (auth.role?.toUpperCase() === 'STUDENT') {
        const studentResponse = await api.get(`http://127.0.0.1:8000/api/students/`);
        console.log(studentResponse.data)
        studentId = studentResponse.data?.find((student) => student.reg_num === auth.user)
        studentId = studentId.st_id
        
        console.log("Student ID: "+students)

        const projectsResponse = await api.get(`http://127.0.0.1:8000/api/projects/?student=${studentId}`);
        projectId = projectsResponse.data[0].project_id;
        console.log("Project ID: "+projectId)

      } else if (auth.role?.toUpperCase() === 'SUPERVISOR' || auth.role?.toUpperCase() === 'HOD' ) {
        console.log("The logged User role is: "+auth.role)
        const supervisorResponse = await api.get(`http://127.0.0.1:8000/api/supervisors/`);
        setSupervisors(supervisorResponse.data);
        console.log(supervisorResponse.data)
        supervisorId = supervisorResponse.data?.find((supervisor) => supervisor.reg_num === auth.user)
        supervisorId = supervisorId.sup_id
        
        const projectsResponse = await api.get(`http://127.0.0.1:8000/api/projects/?supervisor=${supervisorId}`);
        projectId = projectsResponse.data[0].project_id;
        console.log("Project ID: "+projectId)
      }
      console.log("Supervisor ID: "+ supervisorId)
      // Fetch the conversation ID for the project
      const conversationResponse = await api.get(`http://127.0.0.1:8000/api/conversations/?project_id=${projectId}`);
      conversationId = conversationResponse.data[0].id;

      console.log("Conversation ID: "+conversationId)
      // console.log(`Student ID: ${studentId} Project ID: ${projectId} Conversation ID: ${conversationId}`)

      // Navigate to the chat component, passing IDs through navigation state
      navigate('/chat', { state: { studentId, projectId, conversationId } });

    } catch (error) {
      console.error('Error fetching chat data:', error);
    }
  };

  // Fetch conversations on component mount
  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <div className='container'>
      <h1 className="mt-4">Your Conversations</h1>
      <div className="conversation-list">
        {conversations.length === 0 ? (
          <p>No conversations found.</p>
        ) : (
          conversations.map((conversation) => (
            <div key={conversation.id} className="conversation-card p-3 mb-3 border">
              {/* Display project name as heading */}
              <h3>{conversation.project}</h3>

              {/* Display participants */}
              <p className="mb-1">
                <strong>Participants:</strong> {conversation.participants.map(p => p.full_name).join(', ')}
              </p>

              {/* Link to conversation with conversationId passed in state */}
              <button
                onClick={handleChatClick}
                className="btn btn-primary"
              >
                Enter Conversation
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationsList;
