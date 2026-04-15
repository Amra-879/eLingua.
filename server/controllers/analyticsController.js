const submissionModel = require("../models/submissionModel");
const paymentModel = require("../models/paymentModel");
const professorModel = require("../models/professorModel");
const userModel = require("../models/userModel");

const getSubmissionsPerDay = (req, res) => {
  try {
    res.json(submissionModel.getSubmissionsPerDay());
  } catch (err) {
    console.error("GET SUBMISSIONS PER DAY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getRecentSubmissions = (req, res) => {
  try {
    res.json(submissionModel.getRecentSubmissions());
  } catch (err) {
    console.error("GET RECENT SUBMISSIONS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getPendingByLanguage = (req, res) => {
  try {
    res.json(submissionModel.getPendingByLanguage());
  } catch (err) {
    console.error("GET PENDING BY LANGUAGE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getRevenueByLanguage = (req, res) => {
  try {
    res.json(paymentModel.getRevenueByLanguage());
  } catch (err) {
    console.error("GET REVENUE BY LANGUAGE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getTopProfessors = (req, res) => {
  try {
    res.json(professorModel.getTopProfessors());
  } catch (err) {
    console.error("GET TOP PROFESSORS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getTopStudents = (req, res) => {
  try {
    res.json(userModel.getTopStudents());
  } catch (err) {
    console.error("GET TOP STUDENTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getGeneralStats = (req, res) => {
  try {
    const students = userModel.countByRole("student");
    const professors = userModel.countByRole("professor");
    const submissions = submissionModel.getTotalCount();
    const revenue = paymentModel.getTotalRevenue();

    res.json({
      students: students.count,
      professors: professors.count,
      submissions: submissions.count,
      revenue: revenue.total ?? 0,
    });
  } catch (err) {
    console.error("GET GENERAL STATS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getSubmissionsPerDay,
  getRecentSubmissions,
  getPendingByLanguage,
  getRevenueByLanguage,
  getTopProfessors,
  getTopStudents,
  getGeneralStats,
};