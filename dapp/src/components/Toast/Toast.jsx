import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './Toast.css';

const Toast = ({ id, message, type = 'info', onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <div className={`toast-container ${type === 'dark' ? 'dark' : ''}`}>
      <div className="toast-text">
        <p>{message}</p>
      </div>
      <button onClick={() => onClose(id)} className="toast-close-btn">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;