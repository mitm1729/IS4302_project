import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import './ScheduleModal.css';
const ScheduleModal = ({ room, onClose, onSave }) => {
    const [schedules, setSchedules] = useState(room.schedule);
    const [newTime, setNewTime] = useState('');
    const [newAction, setNewAction] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (newTime && newAction) {
        const newSchedule = [
          ...schedules,
          { id: Date.now(), time: newTime, action: newAction, active: true }
        ];
        onSave(newSchedule);
      }
    };
  
    return (
      <div className="modal-overlay">
        <div className="modal schedule-modal">
          <h2>Room Schedule</h2>
          <div className="current-schedules">
            {schedules.map(schedule => (
              <div key={schedule.id} className="schedule-item">
                <Clock className="schedule-icon" />
                <span>{schedule.time}</span>
                <span>{schedule.action}</span>
                <button 
                  className="delete-button"
                  onClick={() => setSchedules(prev => 
                    prev.filter(s => s.id !== schedule.id)
                  )}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="scheduleTime">Time</label>
              <input
                id="scheduleTime"
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="scheduleAction">Action</label>
              <select 
                id="scheduleAction"
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                required
              >
                <option value="">Select action...</option>
                <option value="Lights On">Lights On</option>
                <option value="Lights Off">Lights Off</option>
                <option value="Start Device">Start Device</option>
                <option value="Stop Device">Stop Device</option>
              </select>
            </div>
            <div className="modal-actions">
              <button type="button" className="button secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="button primary">
                Add Schedule
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

export default ScheduleModal;