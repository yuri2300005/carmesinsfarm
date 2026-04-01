require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const pool = require("./config/db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (_req, res) => {
  res.send("CarmesinsFarm API online");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/farm", require("./routes/farm"));

async function bootstrap() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      member_id VARCHAR(30) NOT NULL UNIQUE,
      character_name VARCHAR(120) NOT NULL,
      username VARCHAR(80) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('dev','admin','member') NOT NULL DEFAULT 'member',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS farm_submissions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      farm_date DATE NOT NULL,
      amount INT NOT NULL DEFAULT 0,
      notes VARCHAR(255) DEFAULT NULL,
      proof_image VARCHAR(255) DEFAULT NULL,
      status ENUM('enviado','aprovado','pendente','atrasado') NOT NULL DEFAULT 'enviado',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_daily_submission (user_id, farm_date),
      CONSTRAINT fk_farm_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  const [rows] = await pool.query("SELECT id FROM users WHERE username = 'devuri' LIMIT 1");
  if (!rows.length) {
    const hash = await bcrypt.hash("devuri", 10);
    await pool.query(
      `INSERT INTO users (member_id, character_name, username, password, role)
       VALUES (?, ?, ?, ?, ?)`,
      ["0001", "Dev Uri", "devuri", hash, "dev"]
    );
    console.log("✅ Usuário principal criado: devuri / devuri");
  }
}

bootstrap()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Erro ao iniciar o sistema:", error);
  });
