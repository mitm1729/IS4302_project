// ChatContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext();

// Dummy contacts data - in real app, this would come from your backend
const dummyContacts = [
  { id: 'wallet1', name: 'John Doe', walletId: '0x1234...5678' },
  { id: 'wallet2', name: 'Jane Smith', walletId: '0x8765...4321' },
  { id: 'wallet3', name: 'Bob Wilson', walletId: '0x9876...1234' },
];

export const ChatProvider = ({ children }) => {
  const [ws, setWs] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [contacts, setContacts] = useState(dummyContacts);
  const [selectedChat, setSelectedChat] = useState(null);
  const [currentUser] = useState({ id: 'myWallet', walletId: '0x0000...1111' }); // Replace with actual user data

  useEffect(() => {
    const token = localStorage.getItem('token');
    const socket = new WebSocket(`ws://localhost:5000?token=${token}`);

    socket.onopen = () => {
      setConnected(true);
      setWs(socket);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    };

    socket.onclose = () => {
      setConnected(false);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'chat':
        setMessages(prev => {
          const chatId = data.senderId;
          return {
            ...prev,
            [chatId]: [
              ...(prev[chatId] || []),
              {
                id: Date.now(),
                content: data.message,
                senderId: data.senderId,
                timestamp: data.timestamp,
                isSent: data.senderId === currentUser.id
              }
            ]
          };
        });
        break;

      case 'messageDelivered':
        // Handle message delivery confirmation
        break;

      case 'userStatus':
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          if (data.status === 'online') {
            newSet.add(data.userId);
          } else {
            newSet.delete(data.userId);
          }
          return newSet;
        });
        break;
    }
  };

  const sendMessage = (recipientId, content) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const messageData = {
        type: 'chat',
        recipientId,
        content,
        id: Date.now()
      };

      // Optimistically add message to state
      setMessages(prev => ({
        ...prev,
        [recipientId]: [
          ...(prev[recipientId] || []),
          {
            id: messageData.id,
            content,
            senderId: currentUser.id,
            timestamp: new Date().toISOString(),
            isSent: true
          }
        ]
      }));

      ws.send(JSON.stringify(messageData));
    }
  };

  const sendTypingStatus = (recipientId, isTyping) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'typing',
        recipientId,
        isTyping
      }));
    }
  };

  const startNewChat = (contactId) => {
    setSelectedChat(contactId);
  };

  return (
    <ChatContext.Provider value={{
      connected,
      messages,
      onlineUsers,
      sendMessage,
      sendTypingStatus,
      contacts,
      selectedChat,
      setSelectedChat,
      startNewChat,
      currentUser
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);