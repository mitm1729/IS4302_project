require('dotenv').config();
const express = require('express');
const handler = require('../api/mailApi'); // Adjust the path to your mailing API file

const router = express.Router();

// POST route for sending emails
router.post('/send', handler);

module.exports = router;