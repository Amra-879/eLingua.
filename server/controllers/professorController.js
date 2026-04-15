const professorModel = require("../models/professorModel");
const bcrypt = require("bcrypt");
const db = require("../database/database");

// GET /api/admin/professors
const getAllProfessors = (req, res) => {
  try {
    const professors = professorModel.getAllProfessors();
    res.json(professors);
  } catch (err) {
    console.error("GET PROFESSORS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/admin/professors/:id
const getSingleProfessor = (req, res) => {
  try {
    const professor = professorModel.getProfessorById(req.params.id);
    if (!professor) {
      return res.status(404).json({ message: "Profesor nije pronađen" });
    }
    res.json(professor);
  } catch (err) {
    console.error("GET PROFESSOR ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/admin/professors
const createProfessor = async (req, res) => {
  const { name, lastName, email, password, bio, language } = req.body;

  if (!name || !lastName || !email || !password || !language) {
    return res.status(400).json({ message: "Sva obavezna polja moraju biti ispunjena" });
  }

  try {
    const existingUser = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email);

    if (existingUser) {
      return res.status(400).json({ message: "Email već postoji" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userResult = db.prepare(`
      INSERT INTO users (name, last_name, email, password, role)
      VALUES (?, ?, ?, ?, 'professor')
    `).run(name, lastName, email, hashedPassword);

    professorModel.createProfessor(
      userResult.lastInsertRowid,
      bio || null,
      language
    );

    res.status(201).json({ message: "Profesor uspješno kreiran" });
  } catch (err) {
    console.error("CREATE PROFESSOR ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/admin/professors/:id
const updateProfessor = (req, res) => {
  const { bio, language } = req.body;
  const { id } = req.params;

  if (!language) {
    return res.status(400).json({ message: "Jezik je obavezan" });
  }

  try {
    const existing = professorModel.getProfessorById(id);
    if (!existing) {
      return res.status(404).json({ message: "Profesor nije pronađen" });
    }

    professorModel.updateProfessor(id, bio || null, language);
    res.json({ message: "Profesor ažuriran" });
  } catch (err) {
    console.error("UPDATE PROFESSOR ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/admin/professors/:id
const deleteProfessor = (req, res) => {
  const { id } = req.params;

  try {
    const existing = professorModel.getProfessorById(id);
    if (!existing) {
      return res.status(404).json({ message: "Profesor nije pronađen" });
    }

    professorModel.deleteProfessor(id);
    res.json({ message: "Profesor obrisan" });
  } catch (err) {
    console.error("DELETE PROFESSOR ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllProfessors,
  getSingleProfessor,
  createProfessor,
  updateProfessor,
  deleteProfessor,
};