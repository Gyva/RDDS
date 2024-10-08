import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import './Chat.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from '../contexts/AuthProvider'; // Auth context for authentication

const Chat = ({ isSidebarVisible }) => {
  const [conversations, setConversations] = useState([]); // All conversations
  const [selectedConversation, setSelectedConversation] = useState(null); // Currently selected conversation
  const [messageText, setMessageText] = useState(''); // Message input field
  const { auth, api, refreshToken, logout, accessToken } = useContext(AuthContext); // Auth context values
  const [studentId, setStudentId] = useState(null); // Student ID (if logged in as a student)
  const [projectId, setProjectId] = useState(null); // Project ID related to the student
  const [supervisorId, setSupervisorId] = useState(null); // Supervisor ID (if logged in as a supervisor)
  const [projects, setProjects] = useState([]); // List of projects
  const [messages, setMessages] = useState([]); // List of messages in the conversation
  const [conversationId, setConversationId] = useState(null); // Conversation ID for a project

  // Fetch the user's projects
  const fetchProjects = async () => {
    try {
      // Ensure the access token is present
      if (!auth.accessToken) {
        await refreshToken(); // Trigger token refresh if needed
      }

      // Fetch the projects with the refreshed token
      const response = await api.get('http://127.0.0.1:8000/api/projects/', {
        headers: { 'Content-Type': 'application/json' },
      });
      setProjects(response.data); // Set projects to state
    } catch (error) {
      console.log('Error fetching projects:', error);
    }
  };

  // Fetch the current user ID (Student or Supervisor)
  const getProjectId = async () => {
    try {
      if (auth.role?.toUpperCase() === 'STUDENT') {
        // Get student ID using the registration number from localStorage
        const searchbyregnum_url = `http://127.0.0.1:8000/api/students/?reg_num=${localStorage.getItem('user')}`;
        const response = await axios.get(searchbyregnum_url);
        setStudentId(response.data[0].st_id);
        console.log(response.data[0].st_id)
      } else if (auth.role?.toUpperCase() === 'SUPERVISOR') {
        // Get supervisor ID using the authenticated user
        const searchbyregnum_url = `http://127.0.0.1:8000/api/supervisors/?reg_num=${auth.user}`;
        const response = await axios.get(searchbyregnum_url);
        setSupervisorId(response.data[0]?.sup_id);
      }
    } catch (error) {
      console.error("Failed to get user info: ", error);
    }
  };

  // Get conversation details for the selected project
  const getConversation = async (projectId) => {
    const url = `http://127.0.0.1:8000/api/conversation/?project_id=${projectId}`;
    try {
      const response = await api.get(url);
      setConversationId(response.data.conversation_id); // Set conversation ID based on the project
      console.log("Conversation id: " + response.data.conversation_id)
    } catch (error) {
      console.error("Failed to get conversation: ", error);
    }
  };

  // Fetch messages for the selected conversation
  const getMessages = async (conversationId) => {
    const url = `http://127.0.0.1:8000/api/messages/?conversation_id=${conversationId}`;
    try {
      const response = await api.get(url);
      setMessages(response.data); // Set messages to state
    } catch (error) {
      console.log("Failed to get messages: ", error);
    }
  };

  // Load data on component mount and when accessToken changes
  useEffect(() => {
    if (auth.accessToken) {
      fetchProjects(); // Fetch projects initially
      getProjectId(); // Get project ID for the logged-in user
    } else {
      refreshToken()
        .then(() => {
          fetchProjects();
          getProjectId();
        })
        .catch(error => console.log('Token refresh failed:', error));
    }
  }, [accessToken]);

  // Load project details once projects and studentId are available
  useEffect(() => {
    if (projects && studentId) {
      const specificProject = projects.find((project) => project.student === studentId);
      if (specificProject) {
        setProjectId(specificProject.project_id); // Set projectId when student project is found
      }
    }
  }, [projects, studentId]);

  // Fetch conversation when projectId becomes available
  useEffect(() => {
    if (projectId) {
      getConversation(projectId); // Fetch conversation for the project
    }
  }, [projectId]);

  // Fetch messages when conversationId is available
  useEffect(() => {
    if (conversationId) {
      getMessages(conversationId); // Fetch messages for the conversation
    }
  }, [conversationId]);

  // Handle message sending
  const handleSendMessage = async (e) => {
    e.preventDefault(); // Prevent form submission from refreshing the page
    try {
      // Send the message to the backend
      const response = await api.post('http://127.0.0.1:8000/api/messages/', {
        message: messageText,
        conversation_id: conversationId,
      });
      setMessages([...messages, response.data]); // Append new message to the list
      setMessageText(''); // Clear message input field
    } catch (error) {
      console.log("Failed to send message: ", error);
    }
  };

  return (
    <div className='container'>
      <div className='chat-display-sect'>
        <p className='border p-1 d-flex align-items-center fixed-top header-text'>
          Chat: Supervisor
        </p>
        <div className='messages-container'>
          {messages.map((msg, index) => (
            <div key={index} className='message'>
              <p>{msg.content}</p>
            </div>
          ))}
        </div>
      </div>
      <div className='message-send-sect rounded-top-1 fixed-bottom'>
        <div className='mb-3'>
          <form className='d-flex ml-3 mr-3' onSubmit={handleSendMessage}>
            <textarea
              type='text'
              className='form-group form-control'
              id="message-box"
              placeholder='Write a message'
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              style={{ height: '60px' }}
            />
            &nbsp;<button type='submit' className='form-group btn btn-primary'>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
