const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const router = express.Router();

router.get("/", auth, role("dev", "admin"), async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        u.id,
        u.member_id AS memberId,
        u.character_name AS characterName,
        u.username,
        u.role,
        COALESCE(f.status, 'sem envio') AS todayStatus,
        COALESCE(f.amount, 0) AS todayAmount,
        f.proof_image AS proofImage
      FROM users u
      LEFT JOIN farm_submissions f
        ON f.user_id = u.id AND f.farm_date = CURDATE()
      ORDER BY
        CASE WHEN u.role = 'dev' THEN 1 WHEN u.role = 'admin' THEN 2 ELSE 3 END,
        u.character_name ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao listar membros." });
  }
});

router.post("/", auth, role("dev", "admin"), async (req, res) => {
  try {
    const { memberId, characterName, username, password, role: newRole } = req.body;

    if (!memberId || !characterName || !username || !password || !newRole) {
      return res.status(400).json({ message: "Preencha todos os campos." });
    }

    if (!["admin", "member"].includes(newRole)) {
      return res.status(400).json({ message: "Cargo inválido." });
    }

    const [sameId] = await pool.query("SELECT id FROM users WHERE member_id = ?", [memberId]);
    if (sameId.length) {
      return res.status(409).json({ message: "Esse ID já está em uso." });
    }

    const [sameUser] = await pool.query("SELECT id FROM users WHERE username = ?", [username]);
    if (sameUser.length) {
      return res.status(409).json({ message: "Esse usuário já existe." });
    }

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (member_id, character_name, username, password, role)
       VALUES (?, ?, ?, ?, ?)`,
      [memberId, characterName, username, hash, newRole]
    );

    res.status(201).json({ message: "Membro cadastrado com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao cadastrar membro." });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const targetId = Number(req.params.id);

    if (req.user.role === "member" && req.user.id !== targetId) {
      return res.status(403).json({ message: "Você só pode ver sua própria página." });
    }

    const [userRows] = await pool.query(
      `SELECT id, member_id AS memberId, character_name AS characterName, username, role
       FROM users WHERE id = ? LIMIT 1`,
      [targetId]
    );

    if (!userRows.length) {
      return res.status(404).json({ message: "Membro não encontrado." });
    }

    const [farms] = await pool.query(
      `SELECT id, farm_date AS farmDate, amount, notes, proof_image AS proofImage, status, created_at AS createdAt
       FROM farm_submissions
       WHERE user_id = ?
       ORDER BY farm_date DESC, created_at DESC LIMIT 30`,
      [targetId]
    );

    res.json({ user: userRows[0], farms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao carregar perfil." });
  }
});

module.exports = router;
