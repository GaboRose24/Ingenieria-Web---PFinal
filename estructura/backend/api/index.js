

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usersRoutes from '../src/routes/usersRoutes.js';

dotenv.config();

const app = express();

// CORS: permitir peticiones desde el frontend React 
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Parseo de body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check 
app.get('/api/health', (_req, res) => {
  res.json({ success: true, errors: null, data: { message: 'API funcionando', timestamp: new Date() } });
});

// Rutas de la API
app.use('/api', usersRoutes);

// Ruta no encontrada
app.use((_req, res) => {
  res.status(404).json({ success: false, errors: { general: 'Ruta no encontrada' }, data: null });
});

// Manejador de errores no controlados
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    errors: { general: err.message || 'Algo salió mal' },
    data: null,
  });
});

// Iniciar servidor (solo fuera de Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`🚀 API corriendo en http://localhost:${PORT}`));
}

// Export para Vercel (función serverless)
export default app;
