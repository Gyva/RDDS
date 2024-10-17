import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthProvider';
import './Conversations.css'; // Add any styling you need here

const ConversationsList = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState({});
    const { auth, api } = useContext(AuthContext); // Use the authenticated user
    const [conversations, setConversations] = useState([]);

    // Fetch all conversations for the supervisor/HoD
    const fetchConversations = async () => {
        try {
            const url = `http://127.0.0.1:8000/api/conversations/?participant_id=${auth.id}`; // Adjust the API route accordingly
            const response = await api.get(url);
            setConversations(response.data); // Set conversations data

            // Fetch project details for each conversation
            const projectPromises = response.data.map(async (conversation) => {
                const projectResponse = await api.get(`http://127.0.0.1:8000/api/projects/${conversation.project}`);
                return { id: conversation.project, title: projectResponse.data.title };
            });

            const projectData = await Promise.all(projectPromises);

            // Convert the project array to an object where the key is the project ID
            const projectMap = projectData.reduce((acc, project) => {
                acc[project.id] = project.title;
                return acc;
            }, {});

            setProjects(projectMap); // Store projects with titles in state
        } catch (error) {
            console.error('Failed to fetch conversations or projects:', error);
        }
    };

    const handleChatClick = async (projectId, conversationId) => {
      try {
        navigate('/chat', { state: {projectId, conversationId } });
  
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
                            {/* Display project title or ID if title is not yet available */}
                            <h3>{projects[conversation.project] || conversation.project}</h3>

                            {/* Display participants
                            <p className="mb-1">
                                <strong>Participants:</strong> {conversation.participants.map(p => p.full_name).join(', ')}
                            </p> */}

                            {/* Link to conversation with conversationId passed in state */}
                            <button
                  
                                onClick={()=>handleChatClick(conversation.project,conversation.id)}
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
