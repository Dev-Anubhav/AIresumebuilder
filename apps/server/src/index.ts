import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRouter from './routes/auth.js';
import documentsRouter from './routes/documents.js';
import chatRouter from './routes/chat.js';
import analysisRouter from './routes/analysis.js';
import shareRouter from './routes/share.js';
import resumesRouter from './routes/resumes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/chat', chatRouter);
app.use('/api/analysis', analysisRouter);
app.use('/api/share', shareRouter);
app.use('/api/resumes', resumesRouter);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
