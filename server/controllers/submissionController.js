const submissionModel = require("../models/submissionModel");
const professorModel = require("../models/professorModel");

const calculatePrice = (wordCount) => {
  if (wordCount < 1) return 0;
  const base = 4.0;
  const baseWords = 350;
  const extraRate = 0.5;
  const extraInterval = 50;
  if (wordCount <= baseWords) return base;
  const extraWords = wordCount - baseWords;
  const extraChunks = Math.ceil(extraWords / extraInterval);
  return base + extraChunks * extraRate;
};

// GET /api/submissions/my — student
const getMySubmissions = (req, res) => {
  const student_id = req.user.id;
  try {
    const submissions = submissionModel.getSubmissionsByStudent(student_id);
    res.json(submissions);
  } catch (err) {
    console.error("GET MY SUBMISSIONS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/submissions/pending — profesor
const getPendingSubmissions = (req, res) => {
  const user_id = req.user.id;
  try {
    const professor = professorModel.getProfessorByUserId(user_id);
    if (!professor) {
      return res.status(404).json({ message: "Profesor nije pronađen" });
    }
    const submissions = submissionModel.getAllPendingSubmissions(professor.language_id);
    res.json(submissions);
  } catch (err) {
    console.error("GET PENDING SUBMISSIONS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/submissions/:id — student, profesor, admin
const getSingleSubmission = (req, res) => {
  try {
    const submission = submissionModel.getSubmissionById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    if (
      submission.student_id !== req.user.id &&
      req.user.role !== "professor" &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.json(submission);
  } catch (err) {
    console.error("GET SUBMISSION ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  calculatePrice,
  getMySubmissions,
  getPendingSubmissions,
  getSingleSubmission,
};