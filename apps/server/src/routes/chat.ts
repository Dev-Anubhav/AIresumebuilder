import express, { Router } from 'express';
import {
  sendChatMessage,
  getChatHistory,
  clearChatHistory,
  sendGeneralChatMessage,
} from '../controllers/chatController.js';
import { authenticateToken } from '../middleware/auth.js';

const router: express.Router = Router();


router.use(authenticateToken as any);

router.post('/', sendGeneralChatMessage as any);
router.post('/:documentId/message', sendChatMessage as any);
router.get('/:documentId/history', getChatHistory as any);
router.delete('/:documentId/history', clearChatHistory as any);


export default router;
