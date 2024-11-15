const db = require('./db');

const getRoomsByWalletId = async (walletId) => {
  try {
    const rooms = await db('rooms')
      .where({ wallet_id: walletId })
      .orderBy('position')
      .select('*');

    // Fetch devices for each room
    for (let room of rooms) {
      const devices = await db('devices')
        .where({ room_id: room.id })
        .select('*');
      room.devices = devices;
    }

    return rooms;
  } catch (err) {
    console.error('Error fetching rooms:', err);
    throw new Error('Error fetching rooms');
  }
};

const createRoom = async (roomData) => {
  try {
    // Get the highest position number for this wallet_id
    const maxPosition = await db('rooms')
      .where({ wallet_id: roomData.wallet_id })
      .max('position as maxPos')
      .first();
    
    const newPosition = (maxPosition.maxPos || 0) + 1;
    
    // Insert the room with the new position
    const [roomId] = await db('rooms').insert({
      ...roomData,
      position: newPosition
    });
    
    return roomId;
  } catch (err) {
    console.error('Error creating room:', err);
    throw new Error('Error creating room');
  }
};

const updateRoom = async (roomId, roomData) => {
  try {
    await db('rooms')
      .where({ id: roomId })
      .update({
        ...roomData,
        updated_at: db.fn.now()
      });
    
    return true;
  } catch (err) {
    console.error('Error updating room:', err);
    throw new Error('Error updating room');
  }
};

const deleteRoom = async (roomId) => {
  try {
    await db('rooms').where({ id: roomId }).del();
    return true;
  } catch (err) {
    console.error('Error deleting room:', err);
    throw new Error('Error deleting room');
  }
};

const updateRoomPositions = async (walletId, roomPositions) => {
  try {
    await db.transaction(async (trx) => {
      const updates = roomPositions.map((position, index) => {
        return db('rooms')
          .where({ id: position.roomId, wallet_id: walletId })
          .update({ position: index + 1 })
          .transacting(trx);
      });
      
      await Promise.all(updates);
    });
    
    return true;
  } catch (err) {
    console.error('Error updating room positions:', err);
    throw new Error('Error updating room positions');
  }
};

module.exports = {
  getRoomsByWalletId,
  createRoom,
  updateRoom,
  deleteRoom,
  updateRoomPositions
};