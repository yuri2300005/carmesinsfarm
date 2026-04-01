const express = require("express");
const multer = require("multer");
const path = require("path");
const pool = require("../config/db");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, "..", "uploads")),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || ".jpg");
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});

const upload = multer({ storage });

router.get("/my", auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, farm_date AS farmDate, amount, notes, proof_image AS proofImage, status, created_at AS createdAt
       FROM farm_submissions WHERE user_id = ?
       ORDER BY farm_date DESC, created_at DESC LIMIT 30`,
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar seus farms." });
  }
});

router.post("/my", auth, upload.single("proof"), async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    const notes = req.body.notes || null;
    const proofImage = req.file ? req.file.filename : null;

    if (Number.isNaN(amount)) {
      return res.status(400).json({ message: "Digite um valor válido para o farm." });
    }

    await pool.query(
      `INSERT INTO farm_submissions (user_id, farm_date, amount, notes, proof_image, status)
       VALUES (?, CURDATE(), ?, ?, ?, 'enviado')
       ON DUPLICATE KEY UPDATE
       amount = VALUES(amount),
       notes = VALUES(notes),
       proof_image = VALUES(proof_image),
       status = 'enviado'`,
      [req.user.id, amount, notes, proofImage]
    );

    res.json({ message: "Farm enviado com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao enviar farm." });
  }
});

router.get("/review/list", auth, role("dev", "admin"), async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        f.id,
        f.farm_date AS farmDate,
        f.amount,
        f.notes,
        f.proof_image AS proofImage,
        f.status,
        f.created_at AS createdAt,
        u.id AS userId,
        u.member_id AS memberId,
        u.character_name AS characterName,
        u.username
      FROM farm_submissions f
      INNER JOIN users u ON u.id = f.user_id
      WHERE f.farm_date = CURDATE()
      ORDER BY f.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao listar farms para revisão." });
  }
});

router.patch("/review/:id/status", auth, role("dev", "admin"), async (req, res) => {
  try {
    const { status } = req.body;
    if (!["enviado", "aprovado", "pendente", "atrasado"].includes(status)) {
      return res.status(400).json({ message: "Status inválido." });
    }

    await pool.query("UPDATE farm_submissions SET status = ? WHERE id = ?", [status, req.params.id]);
    res.json({ message: "Status atualizado com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar status." });
  }
});

module.exports = router;
