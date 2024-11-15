import React, { useState, useEffect, useContext } from 'react';
import { 
  Home, Plus, Search,
} from 'lucide-react';
import "./MyHousePage.css";
import EnergyMonitor from '../../components/EnergyMonitor/EnergyMonitor';
import RoomCard from '../../components/RoomCard/RoomCard';
import { useNotification } from '../../context/NotificationContext'; // Import the notification hook

const MyHousePage = () => {

  const [rooms, setRooms] = useState([
    {
      id: 1,
      name: "Living Room",
      devices: [
        { id: 1, name: "Smart TV", type: "tv", status: "on", consumption: 120, battery: 100 },
        { id: 2, name: "Smart Lights", type: "light", status: "off", consumption: 15, battery: 85 }
      ],
      inUse: true,
      caretaker: "John",
      progress: 65,
      temperature: 22,
      humidity: 45,
      tasks: ["Cleaning", "Maintenance"],
      schedule: [
        { id: 1, time: "08:00", action: "Lights On", active: true },
        { id: 2, time: "22:00", action: "Lights Off", active: true }
      ],
      alerts: []
    },
    // ... other rooms
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roomName, setRoomName] = useState('');
  const [totalConsumption, setTotalConsumption] = useState(0);
  const { showNotification } = useNotification(); // Access showNotification
  const [draggedRoomIndex, setDraggedRoomIndex] = useState(null);

  useEffect(() => {
    const total = rooms.reduce((acc, room) => {
      return acc + room.devices.reduce((sum, device) => 
        sum + (device.status === 'on' ? device.consumption : 0), 0);
    }, 0);
    setTotalConsumption(total);
  }, [rooms]);

  const handleDragStart = (e, index) => {
    setDraggedRoomIndex(index);
  };
  
  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedRoomIndex === index) return;
  
    setRooms((prevRooms) => {
      const updatedRooms = [...prevRooms];
      const [draggedRoom] = updatedRooms.splice(draggedRoomIndex, 1);
      updatedRooms.splice(index, 0, draggedRoom);
      setDraggedRoomIndex(index);
      return updatedRooms;
    });
  };
  
  const handleDragEnd = () => {
    setDraggedRoomIndex(null);
  };

  const handleToggleDevice = (roomId, deviceId) => {
    setRooms(prevRooms => 
      prevRooms.map(room => {
        if (room.id === roomId) {
          const updatedDevices = room.devices.map(device => {
            if (device.id === deviceId) {
              const newStatus = device.status === 'on' ? 'off' : 'on';
              showNotification(`${device.name} turned ${newStatus} in ${room.name}`, 'info'); // Use showNotification
              // setNotifications(prev => [{
              //   id: Date.now(),
              //   message: `${device.name} turned ${newStatus} in ${room.name}`,
              //   timestamp: new Date()
              // }, ...prev]);
              return { ...device, status: newStatus };
            }
            return device;
          });
          return { ...room, devices: updatedDevices };
        }
        return room;
      })
    );
  };

  const handleUpdateRoom = (updatedRoom) => {
    setRooms(prevRooms =>
      prevRooms.map(room =>
        room.id === updatedRoom.id ? updatedRoom : room
      )
    );
  };

  const handleAddRoom = () => {
    if (roomName.trim()) {
      const newRoom = {
        id: Date.now(),
        name: roomName,
        devices: [],
        inUse: false,
        temperature: 20,
        humidity: 50,
        progress: 0,
        tasks: [],
        schedule: [],
        alerts: []
      };
      setRooms(prev => [...prev, newRoom]);
      setRoomName('');
    }
  };

  return (
    <div className="house-page">
      <div className="sidebar-house">
        <div className="sidebar-house-header">
          <Home className="sidebar-house-icon" />
          <h1 className="sidebar-house-title">Smart Home</h1>
          
        </div>

        <div className="search-bar">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="add-room-section">
          <input
            type="text"
            placeholder="New room name..."
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="room-input"
          />
          <button 
            className="add-room-button"
            onClick={handleAddRoom}
            disabled={!roomName.trim()}
          >
            <Plus className="add-icon" />
            Add Room
          </button>
        </div>    
      </div>

      <main className="main-content">
        <EnergyMonitor totalConsumption={totalConsumption} />
        
        <div className="rooms-grid">
          {rooms
            .filter(room => 
              room.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((room, index) => (
              <RoomCard
                key={room.id}
                room={room}
                index={index}
                onToggleDevice={handleToggleDevice}
                onUpdateRoom={handleUpdateRoom}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
              />
            ))
          }
        </div>
      </main>
    </div>
  );
};

export default MyHousePage;
