const express = require("express");
const router = express.Router();
const professorController = require("../controllers/professorController");
const analyticsController = require("../controllers/analyticsController");
const { authenticateToken, requireRole } = require("./auth");

const adminOnly = [authenticateToken, requireRole("admin")];

// professors 
router.get("/professors", authenticateToken, requireRole("admin"), professorController.getAllProfessors);
router.get("/professors/:id", authenticateToken, requireRole("admin"), professorController.getSingleProfessor);
router.post("/professors", authenticateToken, requireRole("admin"), professorController.createProfessor);
router.put("/professors/:id", authenticateToken, requireRole("admin"), professorController.updateProfessor);
router.delete("/professors/:id", authenticateToken, requireRole("admin"), professorController.deleteProfessor);


//analytics 
router.get("/analytics/submissions-per-day", authenticateToken, requireRole("admin"), analyticsController.getSubmissionsPerDay);
router.get("/analytics/recent-submissions", authenticateToken, requireRole("admin"), analyticsController.getRecentSubmissions);
router.get("/analytics/pending-by-language", authenticateToken, requireRole("admin"), analyticsController.getPendingByLanguage);
router.get("/analytics/revenue-by-language", authenticateToken, requireRole("admin"), analyticsController.getRevenueByLanguage);
router.get("/analytics/top-professors", authenticateToken, requireRole("admin"), analyticsController.getTopProfessors);
router.get("/analytics/top-students", authenticateToken, requireRole("admin"), analyticsController.getTopStudents);
router.get("/analytics/general-stats", authenticateToken, requireRole("admin"), analyticsController.getGeneralStats);

module.exports = router;