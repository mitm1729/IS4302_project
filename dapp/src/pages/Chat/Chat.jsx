// ChatInterface.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import MessageBubble from '../../components/MessageBubble/MessageBubble';
import './Chat.css';

const Chat = ({ recipientId, recipientName }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  const { connected, messages, onlineUsers, sendMessage, sendTypingStatus } = useChat();
  
  const currentUserMessages = messages[recipientId] || [];

  useEffect(() => {
    scrollToBottom();
  }, [currentUserMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    // Handle typing indicator
    if (!isTyping) {
      setIsTyping(true);
      sendTypingStatus(recipientId, true);
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTypingStatus(recipientId, false);
    }, 1000);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage.trim() && connected) {
      sendMessage(recipientId, newMessage.trim());
      setNewMessage('');
      setIsTyping(false);
      sendTypingStatus(recipientId, false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>{recipientName}</h2>
        <div className={`online-status ${onlineUsers.has(recipientId) ? 'online' : 'offline'}`}>
          {onlineUsers.has(recipientId) ? 'Online' : 'Offline'}
        </div>
      </div>
      
      <div className="messages-container">
        {currentUserMessages.map(message => (
          <MessageBubble
            key={message.id}
            message={message}
            isCurrentUser={message.senderId === recipientId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="message-input-form" onSubmit={handleSend}>
        <input
          type="text"
          value={newMessage}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="message-input"
          disabled={!connected}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={!connected || !newMessage.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;