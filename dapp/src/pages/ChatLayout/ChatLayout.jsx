// ChatLayout.jsx
import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import Chat from '../Chat/Chat';
import './ChatLayout.css';

const ChatSidebar = ({ onNewChat }) => {
  const { contacts, selectedChat, setSelectedChat, messages, onlineUsers } = useChat();
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.walletId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLastMessage = (contactId) => {
    const chatMessages = messages[contactId] || [];
    return chatMessages[chatMessages.length - 1];
  };

  return (
    <div className="chat-sidebar">
      <div className="sidebar-header">
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button 
          className="new-chat-button"
          onClick={() => setIsNewChatModalOpen(true)}
        >
          +
        </button>
      </div>

      <div className="contacts-list">
        {filteredContacts.map(contact => {
          const lastMessage = getLastMessage(contact.id);
          return (
            <div
              key={contact.id}
              className={`contact-item ${selectedChat === contact.id ? 'selected' : ''}`}
              onClick={() => setSelectedChat(contact.id)}
            >
              <div className="contact-avatar">
                {contact.name[0].toUpperCase()}
                <span className={`status-dot ${onlineUsers.has(contact.id) ? 'online' : 'offline'}`} />
              </div>
              <div className="contact-info">
                <div className="contact-name">{contact.name}</div>
                <div className="contact-wallet">{contact.walletId}</div>
                {lastMessage && (
                  <div className="last-message">
                    {lastMessage.content.substring(0, 30)}
                    {lastMessage.content.length > 30 ? '...' : ''}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isNewChatModalOpen && (
        <div className="new-chat-modal">
          <div className="modal-content">
            <h3>Start New Chat</h3>
            <input
              type="text"
              placeholder="Enter wallet address..."
              className="wallet-input"
            />
            <div className="modal-buttons">
              <button onClick={() => setIsNewChatModalOpen(false)}>Cancel</button>
              <button onClick={() => {
                // Handle new chat creation
                setIsNewChatModalOpen(false);
              }}>Start Chat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ChatLayout = () => {
  const { selectedChat, contacts } = useChat();
  
  const selectedContact = contacts.find(c => c.id === selectedChat);

  return (
    <div className="chat-layout">
      <ChatSidebar />
      <div className="chat-main">
        {selectedChat ? (
          <Chat
            recipientId={selectedChat}
            recipientName={selectedContact?.name}
          />
        ) : (
          <div className="no-chat-selected">
            Select a contact to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;