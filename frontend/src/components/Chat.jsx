import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthProvider'; // Your Auth context for authentication

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const { auth } = useContext(AuthContext);

  // fetch project_id where the student id = to logged user id (if student)
  const getProjectId = () => {
    if(auth.role === 'student'){
      
    }
  }


  //fetch conversation_id where project_id is equal to the project id

  //fetch messages where where the conversation id is equal to conversation id 
  
  return (
    
  );
};

export default Chat;
