const Database = require('better-sqlite3');
const path = require('path');

// Connect to SQLite DB (creates file if it doesn't exist in the project root)
const dbPath = path.join(__dirname, '..', '..', 'expenses.db');
const db = new Database(dbPath);

// Enable Write-Ahead Logging for better performance / concurrency
db.pragma('journal_mode = WAL');

// Initialize Schema
// Notice request_id is UNIQUE to handle idempotency (retries).
db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    amount DECIMAL NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    request_id TEXT UNIQUE NOT NULL
  )
`);

module.exports = db;
