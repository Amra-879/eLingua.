const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");
const { authenticateToken, requireRole } = require("./auth");

// profesor kreira feedback
router.post("/", authenticateToken, requireRole("professor"), feedbackController.createFeedback);

// profesor dohvata sve svoje feedbacke (za "Ocijenjene vježbe")
router.get("/my", authenticateToken, requireRole("professor"), feedbackController.getMyFeedbacks);

// student ili profesor dohvata feedback za određeni submission
router.get("/submission/:submissionId", authenticateToken, feedbackController.getFeedbackBySubmission);

module.exports = router;