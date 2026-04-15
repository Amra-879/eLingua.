const db = require('./database/database');

// USERS
db.prepare(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('student','professor','admin')) NOT NULL DEFAULT 'student',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`).run();

// WRITING PROMPTS
db.prepare(`
CREATE TABLE IF NOT EXISTS prompts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    question TEXT NOT NULL,
    created_by INTEGER,
    FOREIGN KEY (created_by) REFERENCES users(id)
)
`).run();

// WRITING SUBMISSIONS 
db.prepare(`
CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    prompt_id INTEGER NOT NULL,
    type TEXT CHECK(type IN ('text','audio')) NOT NULL,
    text_content TEXT,           -- rich text JSON za eseje
    audio_url TEXT,         -- URL do clouda za audio
    measurement INTEGER,    -- broj riječi ili trajanje u sekundama
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(student_id) REFERENCES users(id),
    FOREIGN KEY(prompt_id) REFERENCES prompts(id)
)
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS languages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code text NOT NULL,
    name text NOT NULL
)
`).run();

// PROFESSORS
db.prepare(`
CREATE TABLE IF NOT EXISTS professors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    bio TEXT,
    language INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (language) REFERENCES languages(id) ON DELETE CASCADE
)
`).run();
db.prepare(`
    CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    submission_id INTEGER NOT NULL UNIQUE,
    professor_id INTEGER NOT NULL,
    feedback_essay TEXT,
    feedback_general TEXT,
    assessed_level TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
    FOREIGN KEY (professor_id) REFERENCES users(id)
)
`).run();

console.log("Database setup completed!");
