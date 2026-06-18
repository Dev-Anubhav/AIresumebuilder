import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';
import { generateSummary } from '../services/summaryService.js';
import { extractStructuredData } from '../services/extractionService.js';
import { annotationSchema } from '../validators/schema.js';

export const getAnalysis = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const analysis = await prisma.documentAnalysis.findUnique({
      where: { documentId: req.params.documentId },
    });

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    return res.status(200).json({ analysis });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const regenerateAnalysis = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const documentId = req.params.documentId;
    const document = await prisma.document.findFirst({
      where: { id: documentId, userId: req.user.id },
      include: { chunks: true },
    });

    if (!document) return res.status(404).json({ error: 'Document not found' });

    const fullText = document.chunks.map((c) => c.content).join('\n');
    const analysis = await generateSummary(fullText);
    const extractedData = await extractStructuredData(fullText, analysis.documentType);

    const updated = await prisma.documentAnalysis.upsert({
      where: { documentId },
      update: {
        summary: analysis.summary,
        keyInsights: analysis.keyInsights,
        extractedData: extractedData as any,
        documentType: analysis.documentType,
        language: analysis.language,
        sentiment: analysis.sentiment,
        riskFlags: analysis.riskFlags,
      },
      create: {
        documentId,
        summary: analysis.summary,
        keyInsights: analysis.keyInsights,
        extractedData: extractedData as any,
        documentType: analysis.documentType,
        language: analysis.language,
        sentiment: analysis.sentiment,
        riskFlags: analysis.riskFlags,
      },
    });

    return res.status(200).json({ analysis: updated });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const exportAnalysis = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const analysis = await prisma.documentAnalysis.findUnique({
      where: { documentId: req.params.documentId },
    });

    if (!analysis) return res.status(404).json({ error: 'Analysis not found' });

    const format = req.query.format === 'csv' ? 'csv' : 'json';
    const data = analysis.extractedData as any[];

    if (format === 'csv') {
      let csv = 'Field,Value,Page Reference,Confidence,Category\n';
      data.forEach((row) => {
        csv += `"${row.field}","${row.value}","${row.pageReference}",${row.confidence},"${row.category}"\n`;
      });
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=extracted-data-${req.params.documentId}.csv`);
      return res.status(200).send(csv);
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=extracted-data-${req.params.documentId}.json`);
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// Annotations
export const getAnnotations = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const annotations = await prisma.annotation.findMany({
      where: { documentId: req.params.documentId, userId: req.user.id },
      orderBy: { createdAt: 'asc' },
    });

    return res.status(200).json({ annotations });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const createAnnotation = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const parse = annotationSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: 'Invalid annotation parameters' });

    const { pageNumber, x, y, width, height, text, color } = parse.data;

    const annotation = await prisma.annotation.create({
      data: {
        documentId: req.params.documentId,
        userId: req.user.id,
        pageNumber,
        x,
        y,
        width,
        height,
        text,
        color: color || '#fbbf24',
      },
    });

    return res.status(201).json({ annotation });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteAnnotation = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const annotation = await prisma.annotation.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!annotation) return res.status(404).json({ error: 'Annotation not found' });

    await prisma.annotation.delete({ where: { id: req.params.id } });

    return res.status(200).json({ message: 'Annotation deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
