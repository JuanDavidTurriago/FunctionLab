import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import router from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'FunctionLab API is running',
  });
});

app.use('/api', router);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((error, _req, res, _next) => {
  const statusCode = error.statusCode || 400;

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Unexpected server error',
  });
});

app.listen(PORT, () => {
  console.log(`FunctionLab backend listening on http://localhost:${PORT}`);
});
