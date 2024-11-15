const db = require('./db'); // Knex setup

// CRUD Functions
const getUserByWalletId = async (walletId) => {
    try {
        
      console.log(walletId)
      // Log the entire 'users' table for debugging purposes
      const allUsers = await db('users');
      console.log('Entire users table:', allUsers); // Log entire table
  
      // Query the 'users' table for the specific walletId
      const user = await db('users')
        .where({ wallet_id: walletId })  // Match the wallet_id
        .first();  // Get the first match (assuming wallet_id is unique)
  
      // If no user is found, log and return null
      if (!user) {
        console.log(`No user found for wallet_id: ${walletId}`);
        return null;
      }
  
      return user;
    } catch (err) {
      console.error('Error fetching user by wallet ID:', err);
      throw new Error('Error fetching user'); // Propagate the error
    }
  };
const createUser = async (userData) => db('users').insert(userData);
const updateUser = async (walletId, userData) => db('users').where({ wallet_id: walletId }).update(userData);
const deleteUser = async (walletId) => db('users').where({ wallet_id: walletId }).del();

module.exports = { getUserByWalletId, createUser, updateUser, deleteUser };