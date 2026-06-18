import express, { Router } from 'express';
import { signup, login, logout, me } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router: express.Router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticateToken as any, me as any);

export default router;
