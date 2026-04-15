// server/models/professorModel.js
const db = require("../database/database");

const getAllProfessors = () => {
  return db.prepare(`
    SELECT p.id, p.bio, p.created_at,
           u.id as user_id, u.name, u.last_name, u.email,
           l.id as language_id, l.name as language_name, l.code as language_code
    FROM professors p
    JOIN users u ON p.user_id = u.id
    JOIN languages l ON p.language = l.id
    ORDER BY p.created_at DESC
  `).all();
};

const getProfessorByUserId = (user_id) => {
  return db.prepare(`
    SELECT p.id, p.bio, p.created_at,
           u.id as user_id, u.name, u.last_name, u.email,
           l.id as language_id, l.name as language_name, l.code as language_code
    FROM professors p
    JOIN users u ON p.user_id = u.id
    JOIN languages l ON p.language = l.id
    WHERE p.user_id = ?
  `).get(user_id);
};

const getProfessorById = (id) => {
  return db.prepare(`
    SELECT p.id, p.bio, p.created_at,
           u.id as user_id, u.name, u.last_name, u.email,
           l.id as language_id, l.name as language_name, l.code as language_code
    FROM professors p
    JOIN users u ON p.user_id = u.id
    JOIN languages l ON p.language = l.id
    WHERE p.id = ?
  `).get(id);
};

const createProfessor = (user_id, bio, language) => {
  return db.prepare(`
    INSERT INTO professors (user_id, bio, language)
    VALUES (?, ?, ?)
  `).run(user_id, bio, language);
};

const updateProfessor = (id, bio, language) => {
  return db.prepare(`
    UPDATE professors
    SET bio = ?, language = ?
    WHERE id = ?
  `).run(bio, language, id);
};

const deleteProfessor = (id) => {
  return db.prepare(`
    DELETE FROM professors WHERE id = ?
  `).run(id);
};

const getTopProfessors = () => {
  return db.prepare(`
    SELECT u.name, u.last_name,
           COUNT(f.id) as feedback_count,
           l.name as language_name
    FROM feedback f
    JOIN users u ON f.professor_id = u.id
    JOIN professors pr ON pr.user_id = u.id
    JOIN languages l ON pr.language = l.id
    GROUP BY f.professor_id
    ORDER BY feedback_count DESC
    LIMIT 5
  `).all();
};

module.exports = {
  getAllProfessors,
  getProfessorByUserId,
  getProfessorById,
  createProfessor,
  updateProfessor,
  deleteProfessor,
  getTopProfessors
};