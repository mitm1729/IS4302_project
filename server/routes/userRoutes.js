const express = require('express');
const { verifyToken } = require('../middleware/jwtMiddleware');
const { getUserByWalletId, createUser, updateUser, deleteUser } = require('../models/userModel');
const router = express.Router();

// Get user by wallet ID
router.get('/:walletId', verifyToken, async (req, res) => {

  const { wallet_id } = req.user
  try {
    const user = await getUserByWalletId(wallet_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create new user
router.post('/', verifyToken, async (req, res) => {
  const userData = req.body;
  try {
    await createUser(userData);
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update user by wallet ID
router.put('/:walletId', verifyToken, async (req, res) => {
  const { walletId } = req.params;
  const userData = req.body;
  try {
    const user = await getUserByWalletId(walletId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await updateUser(walletId, userData);
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete user by wallet ID
router.delete('/:walletId', verifyToken, async (req, res) => {
  const { walletId } = req.params;
  try {
    const user = await getUserByWalletId(walletId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await deleteUser(walletId);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Assuming `verifyToken` middleware checks JWT validity
router.get('/me', verifyToken, async (req, res) => {
  try {
    const walletId = req.user.wallet_id; // Ensure this is set properly
    console.log("Decoded wallet_id:", walletId);
    const user = await getUserByWalletId(walletId); // Pass the wallet_id from the token
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user); // Respond with user data
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;