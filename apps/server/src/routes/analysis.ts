import express, { Router } from 'express';
import {
  getAnalysis,
  regenerateAnalysis,
  exportAnalysis,
  getAnnotations,
  createAnnotation,
  deleteAnnotation,
} from '../controllers/analysisController.js';
import { authenticateToken } from '../middleware/auth.js';

const router: express.Router = Router();


router.use(authenticateToken as any);

// Analysis endpoints
router.get('/:documentId', getAnalysis as any);
router.post('/:documentId/regenerate', regenerateAnalysis as any);
router.get('/:documentId/export', exportAnalysis as any);

// Annotations endpoints
router.get('/:documentId/annotations', getAnnotations as any);
router.post('/:documentId/annotations', createAnnotation as any);
router.delete('/annotations/:id', deleteAnnotation as any);

export default router;
