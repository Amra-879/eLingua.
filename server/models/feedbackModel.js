// server/models/feedbackModel.js
const db = require("../database/database");

const createFeedback = (submission_id, professor_id, feedback_essay, feedback_general, assessed_level) => {
  return db.prepare(`
    INSERT INTO feedback (submission_id, professor_id, feedback_essay, feedback_general, assessed_level)
    VALUES (?, ?, ?, ?, ?)
  `).run(submission_id, professor_id, feedback_essay, feedback_general || null, assessed_level || null);
};

const getFeedbackBySubmissionId = (submission_id) => {
  return db.prepare(`
    SELECT f.*,
           u.name as professor_name, u.last_name as professor_last_name
    FROM feedback f
    JOIN users u ON f.professor_id = u.id
    WHERE f.submission_id = ?
  `).get(submission_id);
};

const getFeedbackByProfessor = (professor_id) => {
  return db.prepare(`
    SELECT f.*,
           s.measurement, s.created_at as submission_date,
           p.title as prompt_title, p.level,
           l.name as language_name,
           u.name as student_name, u.last_name as student_last_name
    FROM feedback f
    JOIN submissions s ON f.submission_id = s.id
    JOIN prompts p ON s.prompt_id = p.id
    JOIN languages l ON p.language = l.id
    JOIN users u ON s.student_id = u.id
    WHERE f.professor_id = ?
    ORDER BY f.created_at DESC
  `).all(professor_id);
};

module.exports = {
  createFeedback,
  getFeedbackBySubmissionId,
  getFeedbackByProfessor,
};