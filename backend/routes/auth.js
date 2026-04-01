const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const auth = require("../middleware/auth");
require("dotenv").config();

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Preencha usuário e senha." });
    }

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE username = ? LIMIT 1",
      [username]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: "Senha incorreta." });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, username: user.username },
      process.env.JWT_SECRET || "carmesinsfarm_super_secret",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        memberId: user.member_id,
        characterName: user.character_name,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao fazer login." });
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, member_id AS memberId, character_name AS characterName, username, role
       FROM users WHERE id = ? LIMIT 1`,
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar perfil." });
  }
});

module.exports = router;
