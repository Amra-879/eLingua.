const db = require("../database/database");

const getAllLanguages = () => {
  return db.prepare(`
    SELECT id, code, name FROM languages ORDER BY name ASC
  `).all();
};

const getLanguageById = (id) => {
  return db.prepare(`
    SELECT id, code, name FROM languages WHERE id = ?
  `).get(id);
};

module.exports = {
  getAllLanguages,
  getLanguageById,
};