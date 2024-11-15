// MessageBubble.jsx
import React from 'react';
import './MessageBubble.css';

const MessageBubble = ({ message, isCurrentUser }) => {
    console.log(message);
  return (
    <div className={`message ${isCurrentUser ? 'message-sent' : 'message-received'}`}>
      <div className="message-content">
        <p>{message.content}</p>
        <span className="message-time">
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </div>
  );
};


export default MessageBubble;