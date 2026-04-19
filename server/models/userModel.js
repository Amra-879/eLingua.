// server/models/userModel.js
const db = require("../database/database");

const countByRole = (role) => {
  return db.prepare(`
    SELECT COUNT(*) as count FROM users WHERE role = ?
  `).get(role);
};

const getTopStudents = () => {
  return db.prepare(`
    SELECT u.name, u.last_name,
           COUNT(s.id) as submission_count,
           ROUND(SUM(pay.amount), 2) as total_spent
    FROM submissions s
    JOIN users u ON s.student_id = u.id
    LEFT JOIN payments pay ON pay.submission_id = s.id AND pay.status = 'completed'
    GROUP BY s.student_id
    ORDER BY submission_count DESC
    LIMIT 3
  `).all();
};

module.exports = {
  countByRole,
  getTopStudents,
};