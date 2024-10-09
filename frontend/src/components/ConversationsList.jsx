import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthProvider';
import './Conversations.css'; // Add any styling you need here

const ConversationsList = () => {
    const navigate = useNavigate()
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
      let studentId, projectId, conversationId;

      // Check user role and fetch the necessary IDs
      if (auth.role?.toUpperCase() === 'STUDENT') {
        const studentResponse = await api.get(`http://127.0.0.1:8000/api/students/?reg_num=${auth.user}`);
        studentId = studentResponse.data[0].st_id;

        const projectsResponse = await api.get(`http://127.0.0.1:8000/api/projects/?student=${studentId}`);
        projectId = projectsResponse.data[0].project_id;

      } else if (auth.role?.toUpperCase() === 'SUPERVISOR' || auth.role?.toUpperCase() === 'HoD' ) {
        const supervisorResponse = await api.get(`http://127.0.0.1:8000/api/supervisors/?reg_num=${auth.user}`);
        const supervisorId = supervisorResponse.data[0].sup_id;

        const projectsResponse = await api.get(`http://127.0.0.1:8000/api/projects/?supervisor=${supervisorId}`);
        projectId = projectsResponse.data[0].project_id;
      }

      // Fetch the conversation ID for the project
      const conversationResponse = await api.get(`http://127.0.0.1:8000/api/conversations/?project_id=${projectId}`);
      conversationId = conversationResponse.data[0].id;
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
