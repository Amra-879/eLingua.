const express = require("express");
const router = express.Router();
const locks = require("../locks");
const { authenticateToken, requireRole } = require("./auth");
const db = require("../database/database");

const professorOnly = [authenticateToken, requireRole("professor")];

//lock routes
router.post("/lock/:submissionId", ...professorOnly, (req, res) => {
  const { submissionId } = req.params;
  const professorId = req.user.id;

  const professor = db.prepare("SELECT name, last_name FROM users WHERE id = ?").get(professorId);
  const professorName = professor ? `${professor.name} ${professor.last_name}` : "Profesor";

  const existing = locks.isLocked(submissionId, professorId);
  if (existing) {
    return res.status(423).json({
      message: `Esej trenutno pregledava ${existing.professorName}`,
      lockedBy: existing.professorName,
    });
  }

  locks.lock(submissionId, professorId, professorName);
  res.json({ message: "Submission zaključan" });
});

router.delete("/lock/:submissionId", ...professorOnly, (req, res) => {
  const { submissionId } = req.params;
  const professorId = req.user.id;

  locks.unlock(submissionId, professorId);
  res.json({ message: "Submission otključan" });
});

router.put("/lock/:submissionId", ...professorOnly, (req, res) => {
  const { submissionId } = req.params;
  const professorId = req.user.id;

  locks.refreshLock(submissionId, professorId);
  res.json({ message: "Lock osvježen" });
});

router.get("/locks", ...professorOnly, (req, res) => {
  res.json(locks.getAllLocks());
});

module.exports = router;