const feedbackModel = require("../models/feedbackModel");
const submissionModel = require("../models/submissionModel");

// POST /api/feedback
const createFeedback = (req, res) => {
  const { submission_id, feedback_essay, feedback_general, assessed_level } = req.body;
  const professor_id = req.user.id;

  if (!submission_id) {
    return res.status(400).json({ message: "Submission ID je obavezan" });
  }

  try {
    const submission = submissionModel.getSubmissionById(submission_id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    const isText = submission.type === "text";
    
    // Za tekstualne eseje, feedback_essay je obavezan
    if (isText && !feedback_essay) {
      return res.status(400).json({ message: "Feedback tekst je obavezan za pisani esej" });
    }

    // Za audio eseje, feedback_essay nije potreban 
    // Ali bar generalni komentar mora postojati
    if (!feedback_essay && !feedback_general) {
      return res.status(400).json({ 
        message: "Morate ostaviti opći feedback za ovaj esej" 
      });
    }

    if (submission.status === "reviewed") {
      return res.status(400).json({ message: "Submission je već ocijenjen" });
    }

    feedbackModel.createFeedback(
      submission_id,
      professor_id,
      feedback_essay || null,      
      feedback_general || null,
      assessed_level || null
    );

    submissionModel.markAsReviewed(submission_id);

    res.status(201).json({ message: "Feedback uspješno poslan" });
  } catch (err) {
    console.error("CREATE FEEDBACK ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// GET /api/feedback/submission/:submissionId
const getFeedbackBySubmission = (req, res) => {
  const { submissionId } = req.params;

  try {
    // provjeri da li submission postoji
    const submission = submissionModel.getSubmissionById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // student može vidjeti samo svoj feedback
    if (
      req.user.role === "student" &&
      submission.student_id !== req.user.id
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const feedback = feedbackModel.getFeedbackBySubmissionId(submissionId);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.json(feedback);
  } catch (err) {
    console.error("GET FEEDBACK ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/feedback/my — profesor dohvata sve svoje feedbacke
const getMyFeedbacks = (req, res) => {
  const professor_id = req.user.id;

  try {
    const feedbacks = feedbackModel.getFeedbackByProfessor(professor_id);
    res.json(feedbacks);
  } catch (err) {
    console.error("GET MY FEEDBACKS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createFeedback,
  getFeedbackBySubmission,
  getMyFeedbacks,
};