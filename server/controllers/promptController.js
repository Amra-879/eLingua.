const promptModel = require("../models/promptModel");
const languageModel = require("../models/languageModel");

// GET /api/prompts
const getPrompts = (req, res) => {
  try {
    const prompts = promptModel.getAllPrompts();
    res.json(prompts);
  } catch (err) {
    console.error("GET PROMPTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/prompts/:id
const getSinglePrompt = (req, res) => {
  try {
    const prompt = promptModel.getPromptById(req.params.id);
    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }
    res.json(prompt);
  } catch (err) {
    console.error("GET SINGLE PROMPT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/prompts/languages
const getLanguages = (req, res) => {
  try {
    const languages = languageModel.getAllLanguages();
    res.json(languages);
  } catch (err) {
    console.error("GET LANGUAGES ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getPromptsByLanguage = (req, res) => {
  const { languageId } = req.params;

  try {
    const prompts = promptModel.getPromptsByLanguage(languageId);
    res.json(prompts);
  } catch (err) {
    console.error("GET PROMPTS BY LANGUAGE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/prompts
const createPrompt = (req, res) => {
  const { title, question, language, level } = req.body;
  const userId = req.user.id;

  if (!title || !question || !language || !level) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = promptModel.createPrompt(title, question, language, level, userId);
    res.status(201).json({ message: "Prompt created", id: result.lastInsertRowid });
  } catch (err) {
    console.error("CREATE PROMPT ERROR:", err);
    if (err.message === "Language not found") {
      return res.status(400).json({ message: "Language not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/prompts/:id
const updatePrompt = (req, res) => {
  const { title, question, language, level } = req.body;
  const { id } = req.params;

  if (!title || !question || !language || !level) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existing = promptModel.getPromptById(id);
    if (!existing) {
      return res.status(404).json({ message: "Prompt not found" });
    }

    promptModel.updatePrompt(id, title, question, language, level);
    res.json({ message: "Prompt updated" });
  } catch (err) {
    console.error("UPDATE PROMPT ERROR:", err);
    if (err.message === "Language not found") {
      return res.status(400).json({ message: "Language not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/prompts/:id
const deletePrompt = (req, res) => {
  const { id } = req.params;

  try {
    const existing = promptModel.getPromptById(id);
    if (!existing) {
      return res.status(404).json({ message: "Prompt not found" });
    }

    promptModel.deletePrompt(id);
    res.json({ message: "Prompt deleted" });
  } catch (err) {
    console.error("DELETE PROMPT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getPrompts,
  getSinglePrompt,
  getPromptsByLanguage,
  getLanguages,
  createPrompt,
  updatePrompt,
  deletePrompt,
};