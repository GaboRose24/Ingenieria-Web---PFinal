
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'practica_final',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Verificar conexión al arrancar (solo en desarrollo local)
if (process.env.NODE_ENV !== 'production') {
  pool.getConnection()
    .then((conn) => {
      console.log('✅ MySQL conectado correctamente');
      conn.release();
    })
    .catch((err) => console.error('❌ Error MySQL:', err.message));
}
