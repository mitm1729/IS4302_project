// setupDatabase.js
const knex = require('./db');

const setupDatabase = async () => {
  try {
    // Drop existing tables
    await knex.schema.dropTableIfExists('devices');
    await knex.schema.dropTableIfExists('rooms');
    await knex.schema.dropTableIfExists('users');
    
    // Create users table
    await knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('wallet_id').unique().notNullable();
      table.string('name').nullable();
      table.string('email').nullable();
    });

    // Create rooms table
    await knex.schema.createTable('rooms', (table) => {
      table.increments('id').primary();
      table.string('wallet_id').notNullable();
      table.string('name').notNullable();
      table.boolean('in_use').defaultTo(false);
      table.string('caretaker').nullable();
      table.integer('progress').defaultTo(0);
      table.integer('position').notNullable();
      table.json('tasks').defaultTo('[]');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      // Foreign key relationship
      table.foreign('wallet_id').references('users.wallet_id');
    });

    // Create devices table
    await knex.schema.createTable('devices', (table) => {
      table.increments('id').primary();
      table.integer('room_id').notNullable();
      table.string('name').notNullable();
      table.string('type').notNullable();
      table.string('status').defaultTo('off');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      // Foreign key relationship
      table.foreign('room_id').references('rooms.id').onDelete('CASCADE');
    });

    console.log("Database tables created successfully!");
  } catch (err) {
    console.error('Error setting up the database:', err);
  } finally {
    knex.destroy();
  }
};

setupDatabase();