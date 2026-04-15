const express = require("express");
const router = express.Router();
const promptController = require("../controllers/promptController");
const { authenticateToken, requireRole } = require("./auth");

console.log("authenticateToken:", typeof authenticateToken);
console.log("requireRole:", typeof requireRole);
console.log("getLanguages:", typeof promptController.getLanguages);
console.log("getPromptsByLanguage:", typeof promptController.getPromptsByLanguage);


router.get("/languages", authenticateToken, promptController.getLanguages);
router.get("/language/:languageId", authenticateToken, promptController.getPromptsByLanguage);

// svi prijavljeni korisnici
router.get("/", authenticateToken, promptController.getPrompts);
router.get("/:id", authenticateToken, promptController.getSinglePrompt);

// samo admin
router.post("/", authenticateToken, requireRole("admin"), promptController.createPrompt);
router.put("/:id", authenticateToken, requireRole("admin"), promptController.updatePrompt);
router.delete("/:id", authenticateToken, requireRole("admin"), promptController.deletePrompt);

module.exports = router;

