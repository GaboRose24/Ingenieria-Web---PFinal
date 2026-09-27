-- =====================================================================
-- Base de datos: Práctica Final
-- Tabla `users` — alineada a la API REST de prácticas anteriores
-- Campos en español: nombre, correo, contrasena, rol
-- Equipo: 2 integrantes
-- =====================================================================

CREATE DATABASE IF NOT EXISTS practica_final
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE practica_final;

CREATE TABLE IF NOT EXISTS users (
  id         INT          AUTO_INCREMENT PRIMARY KEY,
  nombre     VARCHAR(100) NOT NULL                          COMMENT 'Nombre completo del usuario',
  correo     VARCHAR(150) NOT NULL UNIQUE                   COMMENT 'Correo electrónico (único)',
  contrasena VARCHAR(255) NOT NULL                          COMMENT 'Contraseña hasheada con bcrypt',
  rol        ENUM('admin','operativo') DEFAULT 'operativo'  COMMENT 'Rol del usuario en el sistema',
  activo     TINYINT(1)   NOT NULL DEFAULT 1                COMMENT 'Eliminación lógica: 1=activo, 0=eliminado',
  deleted_at TIMESTAMP    NULL DEFAULT NULL                 COMMENT 'Fecha/hora de eliminación lógica',
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Usuario administrador de prueba ────────────────────────────────
-- Contraseña: Admin123!
INSERT IGNORE INTO users (nombre, correo, contrasena, rol)
VALUES (
  'Administrador',
  'admin@practica.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'admin'
);

-- ── Usuario operativo de prueba ────────────────────────────────────
-- Contraseña: User123!
INSERT IGNORE INTO users (nombre, correo, contrasena, rol)
VALUES (
  'Usuario Operativo',
  'operativo@practica.com',
  '$2a$10$XcDGVFbPMnFBnlFGxHjkx.tHEGHJzOB9F1gMbr9GdlPHAl3gRf1AS',
  'operativo'
);
