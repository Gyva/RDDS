import React from 'react';

const Message = ({ message }) => {
  return (
    <div className="message">
      <strong>{message.sender.username}</strong>: {message.text}
      {/* Add timestamp or any other additional info here */}
    </div>
  );
};

export default Message;
