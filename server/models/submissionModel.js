const db = require("../database/database");

const createSubmission = (student_id, prompt_id, type, text_content, measurement) => {
  return db.prepare(`
    INSERT INTO submissions (student_id, prompt_id, type, text_content, measurement, status)
    VALUES (?, ?, ?, ?, ?, 'pending')
  `).run(student_id, prompt_id, type, text_content, measurement);
};

const createAudioSubmission = (student_id, prompt_id, audio_url, measurement) => {
  return db.prepare(`
    INSERT INTO submissions (student_id, prompt_id, type, audio_url, measurement, status)
    VALUES (?, ?, 'audio', ?, ?, 'pending')
  `).run(student_id, prompt_id, audio_url, measurement);
};

const getSubmissionsByStudent = (student_id) => {
  return db.prepare(`
    SELECT s.id, s.type, s.measurement, s.status, s.created_at,
           p.title as prompt_title, p.level,
           l.id as language_id, l.name as language_name,
           f.assessed_level
    FROM submissions s
    JOIN prompts p ON s.prompt_id = p.id
    JOIN languages l ON p.language = l.id
    LEFT JOIN feedback f ON f.submission_id = s.id
    WHERE s.student_id = ? 
    ORDER BY s.created_at DESC
  `).all(student_id);
};

const getSubmissionById = (id) => {
  return db.prepare(`
    SELECT s.*, p.title as prompt_title, p.question, p.level,
           l.name as language_name
    FROM submissions s
    JOIN prompts p ON s.prompt_id = p.id
    JOIN languages l ON p.language = l.id
    WHERE s.id = ?
  `).get(id);
};

const getSubmissionsPerDay = () => {
  return db.prepare(`
    SELECT DATE(created_at) as date, COUNT(*) as count
    FROM submissions
    WHERE created_at >= DATE('now', '-14 days')
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `).all();
};

const getRecentSubmissions = () => {
  return db.prepare(`
    SELECT s.id, s.type, s.measurement, s.status, s.created_at,
           p.title as prompt_title,
           l.name as language_name,
           u.name as student_name, u.last_name as student_last_name,
           pu.name as professor_name, pu.last_name as professor_last_name
    FROM submissions s
    JOIN prompts p ON s.prompt_id = p.id
    JOIN languages l ON p.language = l.id
    JOIN users u ON s.student_id = u.id
    LEFT JOIN feedback f ON f.submission_id = s.id
    LEFT JOIN users pu ON f.professor_id = pu.id
    ORDER BY s.created_at DESC
    LIMIT 10
  `).all();
};

const getPendingByLanguage = () => {
  return db.prepare(`
    SELECT l.name as language_name, COUNT(*) as count
    FROM submissions s
    JOIN prompts p ON s.prompt_id = p.id
    JOIN languages l ON p.language = l.id
    WHERE s.status = 'pending'
    GROUP BY l.id
    ORDER BY count DESC
  `).all();
};

const getTotalCount = () => {
  return db.prepare(`
    SELECT COUNT(*) as count FROM submissions
  `).get();
};

const getAllPendingSubmissions = (language_id) => {
  return db.prepare(`
    SELECT s.id, s.type, s.measurement, s.status, s.created_at,
           p.title as prompt_title, p.level,
           l.id as language_id, l.name as language_name,
           u.name as student_name, u.last_name as student_last_name
    FROM submissions s
    JOIN prompts p ON s.prompt_id = p.id
    JOIN languages l ON p.language = l.id
    JOIN users u ON s.student_id = u.id
    WHERE s.status = 'pending' AND p.language = ?
    ORDER BY s.created_at ASC
  `).all(language_id);
};

const markAsReviewed = (id) => {
  return db.prepare(`
    UPDATE submissions SET status = 'reviewed' WHERE id = ?
  `).run(id);
};


module.exports = {
  createSubmission,
  createAudioSubmission,
  getSubmissionsByStudent,
  getSubmissionById,
  getSubmissionsPerDay,
  getRecentSubmissions,
  getPendingByLanguage,
  getTotalCount,
  getAllPendingSubmissions,
  markAsReviewed
};