const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submissionController");
const { authenticateToken, requireRole } = require("./auth");

router.get("/my", authenticateToken, requireRole("student"), submissionController.getMySubmissions);
router.get("/pending", authenticateToken, requireRole("professor"), submissionController.getPendingSubmissions);
router.get("/:id", authenticateToken, submissionController.getSingleSubmission);



module.exports = router;