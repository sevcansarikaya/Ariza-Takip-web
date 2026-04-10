const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./ariza_takip.db");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT,
        lastName TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT
    )`);

  db.run(`CREATE TABLE IF NOT EXISTS faults (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        deviceName TEXT,
        deviceType TEXT,
        description TEXT,
        priority TEXT,
        status TEXT DEFAULT 'Beklemede',
        userId INTEGER,
        imageUrl TEXT,
        techNote TEXT, 
        FOREIGN KEY(userId) REFERENCES users(id)
    )`);


  db.run(`CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        message TEXT,
        isRead INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

module.exports = db;
