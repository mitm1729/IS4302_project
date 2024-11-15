import React, { createContext, useContext, useReducer } from 'react';
import Toast from '../components/Toast/Toast';

const NotificationContext = createContext();

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return [...state, action.payload];
    case 'REMOVE_NOTIFICATION':
      return state.filter((notification) => notification.id !== action.payload);
    default:
      return state;
  }
};

export const NotificationProvider = ({ children }) => {
  const [notifications, dispatch] = useReducer(notificationReducer, []);

  const showNotification = (message, type = 'info', duration = 5000) => {
    const id = Date.now();
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { id, message, type, duration },
    });
  };

  const removeNotification = (id) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: '1rem',
          left: '2rem',
          width : "auto",
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        {notifications.map((notification) => (
          <Toast
            key={notification.id}
            id={notification.id}
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onClose={removeNotification}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};