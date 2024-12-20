import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Configuration de la base de données
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pile_ou_face",
});

// Connexion a la base de données
db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données :", err);
  } else {
    console.log("Connecté à la base de données MySQL");
  }
});

const JWT_SECRET = "1234";

// Route pour la connexion
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email et mot de passe requis" });
  }

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Erreur serveur" });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    return res.json({ success: true, token });
  });
});

// Route pour les informations utilisateur
app.get("/api/user-info", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, message: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Token invalide" });
    }

    const query = "SELECT email, role, balance FROM users WHERE id = ?";
    db.query(query, [decoded.id], (err, results) => {
      if (err || results.length === 0) {
        return res.status(500).json({ success: false, message: "Erreur lors de la récupération des données" });
      }

      const user = results[0];
      res.json({ success: true, user });
    });
  });
});

// Route pour tester l'authentification
app.get("/api/home", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, message: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Token invalide" });
    }

    res.json({ success: true, message: "Bienvenue sur la page d'accueil !" });
  });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
