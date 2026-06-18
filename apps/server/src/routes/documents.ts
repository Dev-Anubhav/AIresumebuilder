import express, { Router } from 'express';
import {
  uploadDocument,
  getDocuments,
  getDocumentDetails,
  renameDocument,
  deleteDocument,
  getDocumentStatus,
  getDocumentFile,
} from '../controllers/documentController.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router: express.Router = Router();


router.use(authenticateToken as any);

router.post('/upload', upload.single('file'), uploadDocument as any);
router.get('/', getDocuments as any);
router.get('/:id', getDocumentDetails as any);
router.patch('/:id', renameDocument as any);
router.delete('/:id', deleteDocument as any);
router.get('/:id/status', getDocumentStatus as any);
router.get('/:id/file', getDocumentFile as any);

export default router;
