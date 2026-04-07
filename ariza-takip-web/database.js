const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./ariza_takip.db');

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
        FOREIGN KEY(userId) REFERENCES users(id)
    )`);
});

module.exports = db;