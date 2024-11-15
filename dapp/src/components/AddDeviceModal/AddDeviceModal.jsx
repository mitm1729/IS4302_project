import "./AddDeviceModal.css";
import React, { useState } from 'react';
// Move modals to separate components for better organization
const AddDeviceModal = ({ onClose, onAdd }) => {
    const [deviceName, setDeviceName] = useState('');
    const [deviceType, setDeviceType] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (deviceName && deviceType) {
        onAdd({
          id: Date.now(),
          name: deviceName,
          type: deviceType,
          status: 'off',
          consumption: Math.floor(Math.random() * 1000),
          battery: 100
        });
      }
    };
  
    return (
      <div className="modal-overlay">
        <div className="modal device-modal">
          <h2>Add New Device</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="deviceName">Device Name</label>
              <input
                id="deviceName"
                type="text"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                placeholder="Enter device name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="deviceType">Device Type</label>
              <select
                id="deviceType"
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value)}
                required
              >
                <option value="">Select type...</option>
                <option value="light">Light</option>
                <option value="thermostat">Thermostat</option>
                <option value="appliance">Appliance</option>
                <option value="security">Security</option>
              </select>
            </div>
            <div className="modal-actions">
              <button type="button" className="button secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="button primary">
                Add Device
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

export default AddDeviceModal;