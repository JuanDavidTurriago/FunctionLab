import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import router from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares globales: habilitan peticiones desde el frontend, registran
// cada solicitud y convierten automaticamente el cuerpo JSON en req.body.
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Endpoint liviano para comprobar que el servidor esta disponible.
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'FunctionLab API is running',
  });
});

// Todas las operaciones matematicas quedan agrupadas bajo el prefijo /api.
app.use('/api', router);

// Respuesta uniforme para cualquier ruta que no exista.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Los controladores delegan aqui sus errores mediante next(error).
app.use((error, _req, res, _next) => {
  const statusCode = error.statusCode || 400;

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Unexpected server error',
  });
});

// Este archivo es el unico responsable de abrir el puerto HTTP.
app.listen(PORT, () => {
  console.log(`FunctionLab backend listening on http://localhost:${PORT}`);
});
