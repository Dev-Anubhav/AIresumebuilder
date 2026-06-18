import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';
import { documentQueue } from '../lib/queue.js';
import fs from 'fs';
import path from 'path';

export const uploadDocument = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const doc = await prisma.document.create({
      data: {
        title: req.body.title || req.file.originalname,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        status: 'PROCESSING',
        filePath: req.file.path,
        userId: req.user.id,
      },
    });

    // Enqueue document processing task
    await documentQueue.add('process', { documentId: doc.id });

    return res.status(201).json({ document: doc });
  } catch (err: any) {
    console.error('Upload document error:', err);
    return res.status(500).json({ error: err.message || 'Upload failed' });
  }
};

export const getDocuments = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const documents = await prisma.document.findMany({
      where: { userId: req.user.id },
      include: { analysis: true },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ documents });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const getDocumentDetails = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const document = await prisma.document.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: { analysis: true, annotations: true },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    return res.status(200).json({ document });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const renameDocument = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const updated = await prisma.document.update({
      where: { id: req.params.id, userId: req.user.id },
      data: { title },
    });

    return res.status(200).json({ document: updated });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteDocument = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const doc = await prisma.document.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!doc) return res.status(404).json({ error: 'Document not found' });

    // Delete record from DB
    await prisma.document.delete({ where: { id: doc.id } });

    // Delete file from storage
    if (fs.existsSync(doc.filePath)) {
      fs.unlinkSync(doc.filePath);
    }

    return res.status(200).json({ message: 'Document deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const getDocumentStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const doc = await prisma.document.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      select: { status: true, pageCount: true },
    });

    if (!doc) return res.status(404).json({ error: 'Document not found' });

    return res.status(200).json({ status: doc.status, pageCount: doc.pageCount });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const getDocumentFile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const doc = await prisma.document.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!doc) return res.status(404).json({ error: 'Document not found' });

    if (!fs.existsSync(doc.filePath)) {
      return res.status(404).json({ error: 'Physical file not found on disk' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    return res.sendFile(path.resolve(doc.filePath));
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
