const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('memories.db');

// Drop existing tables
const dropTables = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('DROP TABLE IF EXISTS memory_lane_share')
        .run('DROP TABLE IF EXISTS memories')
        .run('DROP TABLE IF EXISTS memory_lane')
        .run('DROP TABLE IF EXISTS user', (err) => {
          if (err) reject(err);
          else resolve(true);
        });
    });
  });
};

// Create tables with exact schema
const createTables = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create memories table
      db.run(`
        CREATE TABLE IF NOT EXISTS memories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          description TEXT,
          image_url TEXT,
          memory_lane_id INTEGER,
          timestamp DATE
        )
      `)
      // Create memory_lane table
      .run(`
        CREATE TABLE IF NOT EXISTS memory_lane (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          user_id INTEGER
        )
      `)
      // Create user table
      .run(`
        CREATE TABLE IF NOT EXISTS user (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT
        )
      `)
      // Create memory_lane_share table
      .run(`
        CREATE TABLE IF NOT EXISTS memory_lane_share (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          memory_lane_id INTEGER,
          has_viewed INTEGER
        )
      `, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  });
};

// Execute the recreation
const recreateDatabase = async () => {
  try {
    console.log('Dropping existing tables...');
    await dropTables();
    console.log('Creating new tables...');
    await createTables();
    console.log('Database recreation completed successfully!');
    db.close();
  } catch (error) {
    console.error('Error recreating database:', error);
    db.close();
  }
};

recreateDatabase(); 