require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/userModel'); // Assuming you're using the user model for querying user data

// POST /api/auth/authenticate - Authenticates wallet and issues JWT
router.post('/authenticate', async (req, res) => {
  const { account, signature } = req.body;

  if (!account || !signature) {
    return res.status(400).json({ error: 'Account and signature are required' });
  }

  try {
    // Here you can verify the signature with the blockchain to confirm the user
    const isValidSignature = await verifySignature(account, signature);
    if (!isValidSignature) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Check if the user exists or create a new user
    let user = await User.getUserByWalletId(account);
    if (!user) {
      user = await User.createUser({ wallet_id: account }); // Assuming you have the wallet_id field
    }

    // Generate JWT token
    const token = jwt.sign({ wallet_id: account }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log(token)
    // Respond with the token
    res.json({ token });
  } catch (error) {
    console.error('Authentication error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Function to verify the signature (replace this with actual verification logic)
async function verifySignature(account, signature) {
  // Add your blockchain verification logic here (e.g., check the signature on the Ethereum blockchain)
  // For now, just return true for simplicity.
  return true;
}

module.exports = router;