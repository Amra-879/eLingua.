const Database = require('better-sqlite3');
const path = require('path');

// Kreira (ili otvara) eLinguaDB.db u server folderu
const db = new Database(path.join(__dirname, '../eLinguaDB.db'));

// Omogući foreign keys
db.pragma('foreign_keys = ON');

module.exports = db;
