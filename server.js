// server.js
import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Initialize SQLite Database stored locally on disk
const db = new Database(path.join(__dirname, 'notes.db'));

// Create notes table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    courseId TEXT,
    courseName TEXT,
    date TEXT,
    timestamp TEXT,
    updatedAt TEXT,
    tags TEXT,
    content TEXT
  )
`);

// API Routes

// 1. Get all notes
app.get('/api/notes', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM notes ORDER BY timestamp DESC').all();
    const notes = rows.map(row => ({
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : []
    }));
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Save / Update Note (Upsert)
app.post('/api/notes', (req, res) => {
  try {
    const note = req.body;
    const stmt = db.prepare(`
      INSERT INTO notes (id, title, courseId, courseName, date, timestamp, updatedAt, tags, content)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title=excluded.title,
        courseId=excluded.courseId,
        courseName=excluded.courseName,
        date=excluded.date,
        timestamp=excluded.timestamp,
        updatedAt=excluded.updatedAt,
        tags=excluded.tags,
        content=excluded.content
    `);

    stmt.run(
      note.id,
      note.title || 'Untitled Note',
      note.courseId || '',
      note.courseName || '',
      note.date || '',
      note.timestamp || new Date().toISOString(),
      note.updatedAt || new Date().toISOString(),
      JSON.stringify(note.tags || []),
      note.content || ''
    );

    res.json({ success: true, note });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Delete Note
app.delete('/api/notes/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM notes WHERE id = ?').run(id);
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seed default notes if DB is empty
app.post('/api/notes/seed', (req, res) => {
  try {
    const count = db.prepare('SELECT count(*) as count FROM notes').get().count;
    if (count === 0 && Array.isArray(req.body.notes)) {
      const insert = db.prepare(`
        INSERT INTO notes (id, title, courseId, courseName, date, timestamp, updatedAt, tags, content)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const insertMany = db.transaction((notesList) => {
        for (const note of notesList) {
          insert.run(
            note.id,
            note.title,
            note.courseId,
            note.courseName,
            note.date,
            note.timestamp,
            note.updatedAt,
            JSON.stringify(note.tags || []),
            note.content
          );
        }
      });
      insertMany(req.body.notes);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`SQLite database server running on http://localhost:${PORT}`);
});
