const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../database/database");

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "secretkey"; // for development purposes only

// ==================
// MIDDLEWARE
// ==================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

// REGISTER


router.post("/register", async (req, res) => {
  const { name, lastName, email, password } = req.body;

  if (!name || !lastName || !email || !password) {
    return res.status(400).json({ message: "Sva polja su obavezna" });
  }

  try {
    const existingUser = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email);

    if (existingUser) {
      return res.status(400).json({ message: "Email već postoji." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = "student"; // default rola

    const result = db
      .prepare(
        `INSERT INTO users (name, last_name, email, password, role)
         VALUES (?, ?, ?, ?, ?)`
      )
      .run(name, lastName, email, hashedPassword, role);

    const token = jwt.sign(
      { id: result.lastInsertRowid, role },
      SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({ token, role, name });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Sva polja su obavezna" });
  }

  try {
    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email);

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role, name: user.name });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ME endpoint (dohvati trenutnog korisnika)

router.get("/me", authenticateToken, (req, res) => {
  try {
    const user = db
      .prepare(
        `SELECT id, name, last_name, email, role 
         FROM users WHERE id = ?`
      )
      .get(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// newsletter pretplata
router.post("/subscribe-newsletter", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email je obavezan" });
  }

  try {
    // Provjeri da li korisnik postoji i da li se email poklapa
    const user = db
      .prepare("SELECT id, email, newsletter FROM users WHERE id = ?")
      .get(userId);

    if (!user) {
      return res.status(404).json({ message: "Korisnik nije pronađen" });
    }

    // Provjeri da li je email isti kao u bazi 
    if (user.email !== email) {
      return res.status(400).json({ message: "Email se ne poklapa sa korisničkim nalogom" });
    }

    if (user.newsletter === 1) {
      return res.status(200).json({ message: "Već ste prijavljeni na newsletter", alreadySubscribed: true });
    }

    // Ažuriraj newsletter field iz 0 u 1
    const result = db
      .prepare("UPDATE users SET newsletter = 1 WHERE id = ?")
      .run(userId);

    if (result.changes === 0) {
      return res.status(404).json({ message: "Korisnik nije pronađen" });
    }

    res.status(200).json({ message: "Uspješno ste prijavljeni na newsletter", subscribed: true });

  } catch (err) {
    console.error("NEWSLETTER SUBSCRIBE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
module.exports.authenticateToken = authenticateToken;
module.exports.requireRole = requireRole;
