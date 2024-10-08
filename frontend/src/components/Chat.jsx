import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import './Chat.css';
import { AuthContext } from '../contexts/AuthProvider';
import { useLocation } from 'react-router-dom'; // To access state from navigation

const Chat = () => {
  const [messages, setMessages] = useState([]); // List of messages in the conversation
  const [messageText, setMessageText] = useState(''); // Message input field
  const { auth, api, refreshToken } = useContext(AuthContext); // Auth context values
  const location = useLocation(); // Get state from the navigation

  // Destructure the state from the location object
  const { studentId, projectId, conversationId } = location.state || {};

  // Function to fetch messages for a conversation
  const getMessages = async (conversationId) => {
    try {
      const url = `http://127.0.0.1:8000/api/messages/?conversation_id=${conversationId}`;
      const response = await api.get(url);
      setMessages(response.data); // Set messages
    } catch (error) {
      console.error("Failed to get messages: ", error);
    }
  };

  // Fetch messages when conversationId is available
  useEffect(() => {
    if (conversationId) {
      getMessages(conversationId);
    }
  }, [conversationId]);

  // Handle message sending
  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('http://127.0.0.1:8000/api/messages/', {
        text: messageText,
        conversation: conversationId,
        sender:auth.id
      });
      setMessages([...messages, response.data]); // Append new message to list
      setMessageText(''); // Clear input field
    } catch (error) {
      console.error("Failed to send message: ", error);
    }
  };

  return (
    <div className='container'>
      {/* Chat header */}
      <div className='chat-display-sect'>
        <p className='border p-1 d-flex align-items-center fixed-top header-text'>
          Chat with Supervisor
        </p>

        {/* Messages display section */}
        <div className='messages-container'>
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`message ${
                msg.sender === studentId ? 'sent' : 'received'
              }`} // Apply different styles for sent and received messages
            >
              <div className='message-info'>
                <p className='message-text'>{msg.text}</p>
                <small className='message-timestamp'>
                  {new Date(msg.timestamp).toLocaleString()} {/* Format timestamp */}
                </small>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message input section */}
      <div className='message-send-sect rounded-top-1 fixed-bottom'>
        <form className='d-flex ml-3 mr-3' onSubmit={handleSendMessage}>
          <textarea
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
  );
};

export default Chat;
