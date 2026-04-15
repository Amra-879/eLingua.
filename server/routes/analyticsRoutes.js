const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");
const { authenticateToken, requireRole } = require("./auth");

router.get("/submissions-per-day", authenticateToken, requireRole("admin"), analyticsController.getSubmissionsPerDay);
router.get("/recent-submissions", authenticateToken, requireRole("admin"), analyticsController.getRecentSubmissions);
router.get("/pending-by-language", authenticateToken, requireRole("admin"), analyticsController.getPendingByLanguage);
router.get("/revenue-by-language", authenticateToken, requireRole("admin"), analyticsController.getRevenueByLanguage);
router.get("/top-professors", authenticateToken, requireRole("admin"), analyticsController.getTopProfessors);
router.get("/top-students", authenticateToken, requireRole("admin"), analyticsController.getTopStudents);
router.get("/general-stats", authenticateToken, requireRole("admin"), analyticsController.getGeneralStats);

module.exports = router;