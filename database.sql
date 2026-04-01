CREATE DATABASE IF NOT EXISTS carmesinsfarm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE carmesinsfarm;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  member_id VARCHAR(30) NOT NULL UNIQUE,
  character_name VARCHAR(120) NOT NULL,
  username VARCHAR(80) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('dev','admin','member') NOT NULL DEFAULT 'member',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
);
