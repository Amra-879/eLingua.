const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { authenticateToken, requireRole } = require("./auth");
const upload = require("../middleware/audioUpload");

router.post("/create-order", authenticateToken, requireRole("student"), paymentController.createOrder);
router.post("/capture-order", authenticateToken, requireRole("student"), paymentController.captureOrder);
router.post("/create-audio-order", authenticateToken, requireRole("student"), paymentController.createAudioOrder);
router.post("/capture-audio-order", authenticateToken, requireRole("student"), upload.single("audio"), paymentController.captureAudioOrder);
router.get("/my", authenticateToken, requireRole("student"), paymentController.getMyPayments);

module.exports = router;