import express, { Router } from 'express';
import {
  createResume,
  getResumes,
  getResumeDetails,
  updateResume,
  deleteResume,
} from '../controllers/resumeController.js';
import { authenticateToken } from '../middleware/auth.js';

const router: express.Router = Router();

router.use(authenticateToken as any);

router.post('/', createResume as any);
router.get('/', getResumes as any);
router.get('/:id', getResumeDetails as any);
router.put('/:id', updateResume as any);
router.delete('/:id', deleteResume as any);

export default router;
