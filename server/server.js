require("dotenv").config();
const express = require("express");
const cors = require("cors");
const promptRoutes = require("./routes/promptRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const adminRoutes = require("./routes/adminRoutes");
const professorRoutes = require("./routes/professorRoutes");
const path = require("path");

const authRoutes = require("./routes/auth");

const app = express();

app.use("/uploads/audio", express.static(path.join(__dirname, "uploads/audio")));

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/prompts", promptRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", professorRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
