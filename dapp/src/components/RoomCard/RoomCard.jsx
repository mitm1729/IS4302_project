import React, { useState } from 'react';
import {
  Calendar, Plus, MoreVertical, User,
  AlertTriangle, Sun, Thermometer, Settings,
  BatteryCharging
} from 'lucide-react';
import './RoomCard.css';
import AddDeviceModal from '../../components/AddDeviceModal/AddDeviceModal';
import ScheduleModal from '../../components/ScheduleModal/ScheduleModal';

const RoomCard = ({ room, index, onToggleDevice, onUpdateRoom, onDragStart, onDragEnd, onDragOver }) => {
    const [showDeviceModal, setShowDeviceModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const getDeviceIcon = (type) => {
    switch (type) {
      case 'light': return <Sun />;
      case 'thermostat': return <Thermometer />;
      default: return <Settings />;
    }
  };

  const handleAddDevice = (device) => {
    onUpdateRoom({
      ...room,
      devices: [...room.devices, device]
    });
    setShowDeviceModal(false);
  };

  const handleUpdateSchedule = (newSchedule) => {
    onUpdateRoom({
      ...room,
      schedule: newSchedule
    });
    setShowScheduleModal(false);
  };

  return (
    <div
      className="room-card"
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <div className="room-card-header">
        <div className="room-card-header-1">
          <h3 className="room-card-title">{room.name}</h3>
          <div className="room-card-info">
            <span className="room-card-info-item">
              <Thermometer className="icon" />
              {room.temperature}°C
            </span>
            <span className="room-card-info-item">
              <User className="icon" />
              {room.humidity}%
            </span>
          </div>
        </div>
          
          <div className="room-card-actions">
            <button className="room-card-button"
            onClick={() => setShowScheduleModal(true)}><Calendar /></button>
            <button className="room-card-button"
            onClick={() => setShowDeviceModal(true)}><Plus /></button>
            <button className="room-card-button"><MoreVertical /></button>
        </div>
   
    </div>

      {room.inUse && (
        <div className="room-card-progress">
          <div className="room-card-progress-text">
            <span>Progress</span>
            <span>{room.progress}%</span>
          </div>
          <div className="room-card-progress-bar">
            <div
              className="room-card-progress-fill"
              style={{ width: `${room.progress}%` }}
            />
          </div>
        </div>
      )}

      {room.alerts?.length > 0 && (
        <div className="room-card-alerts">
          {room.alerts.map(alert => (
            <div
              key={alert.id}
              className={`room-card-alert ${alert.severity === 'warning' ? 'room-card-alert-warning' : 'room-card-alert-error'}`}
            >
              <AlertTriangle className="icon" />
              <span>{alert.message}</span>
            </div>
          ))}
        </div>
      )}

      <div className="room-card-devices">
        <h4>Devices</h4>
        {room.devices.map(device => (
          <div key={device.id} className="room-card-device">
            <div className="room-card-device-info">
              {getDeviceIcon(device.type)}
              <span>{device.name}</span>
            </div>
            <div className="room-card-device-status">
              <span>{device.status === 'on' ? `${device.consumption}W` : '0W'}</span>
              <div><BatteryCharging className="icon" />{device.battery}%</div>
              <button
                onClick={() => onToggleDevice(room.id, device.id)}
                className={`room-card-device-toggle ${device.status === 'on' ? 'room-card-device-toggle-on' : 'room-card-device-toggle-off'}`}
              >
                {device.status.toUpperCase()}
              </button>
            </div>
          </div>
        ))}
      </div>
       {showDeviceModal && (
            <AddDeviceModal
              onClose={() => setShowDeviceModal(false)}
              onAdd={handleAddDevice}
            />
          )}

          {showScheduleModal && (
            <ScheduleModal
              room={room}
              onClose={() => setShowScheduleModal(false)}
              onSave={handleUpdateSchedule}
            />
          )}
    </div>
    
  );
};

export default RoomCard;