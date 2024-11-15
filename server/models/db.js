// db.js
const knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: './data.sqlite' // Path to your SQLite database file
    },
    useNullAsDefault: true // Needed for SQLite3 to handle null values properly
  });
  
  module.exports = knex;