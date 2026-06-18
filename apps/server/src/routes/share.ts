import express, { Router } from 'express';
import {
  createShareToken,
  revokeShareToken,
  getSharedDocument,
  chatOnSharedDocument,
} from '../controllers/shareController.js';
import { authenticateToken } from '../middleware/auth.js';

const router: express.Router = Router();


// Private share controls
router.post('/:documentId', authenticateToken as any, createShareToken as any);
router.delete('/:documentId', authenticateToken as any, revokeShareToken as any);

// Public links accessing endpoints
router.get('/public/:shareId', getSharedDocument as any);
router.post('/public/:shareId/chat', chatOnSharedDocument as any);

export default router;
