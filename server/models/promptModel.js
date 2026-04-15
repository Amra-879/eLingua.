const db = require("../database/database");
const languageModel = require("./languageModel");

const getAllPrompts = () => {
  return db.prepare(`
    SELECT p.id, p.title, p.question, p.level, p.created_by,
           l.id as language_id, l.name as language_name, l.code as language_code
    FROM prompts p
    JOIN languages l ON p.language = l.id
  `).all();
};

const getPromptById = (id) => {
  return db.prepare(`
    SELECT p.*, l.name as language_name, l.code as language_code
    FROM prompts p
    JOIN languages l ON p.language = l.id
    WHERE p.id = ?
  `).get(id);
};

const getPromptsByLanguage = (languageId) => {
  return db.prepare(`
    SELECT p.id, p.title, p.question, p.level,
           l.id as language_id, l.name as language_name, l.code as language_code
    FROM prompts p
    JOIN languages l ON p.language = l.id
    WHERE p.language = ?
    ORDER BY p.level ASC
  `).all(languageId);
};

const createPrompt = (title, question, language, level, created_by) => {
  
  const lang = languageModel.getLanguageById(language);
  if (!lang) throw new Error("Language not found");

  return db.prepare(`
    INSERT INTO prompts (title, question, language, level, created_by)
    VALUES (?, ?, ?, ?, ?)
  `).run(title, question, language, level, created_by);
};

const updatePrompt = (id, title, question, language, level) => {
  
  const lang = languageModel.getLanguageById(language);
  if (!lang) throw new Error("Language not found");

  return db.prepare(`
    UPDATE prompts 
    SET title = ?, question = ?, language = ?, level = ?
    WHERE id = ?
  `).run(title, question, language, level, id);
};

const deletePrompt = (id) => {
  return db.prepare(`
    DELETE FROM prompts WHERE id = ?
  `).run(id);
};

module.exports = {
  getAllPrompts,
  getPromptById,
  getPromptsByLanguage,
  createPrompt,
  updatePrompt,
  deletePrompt,
};