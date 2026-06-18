import { Response, Request } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';
import { runChatPipeline } from '../services/chatService.js';
import { messageSchema } from '../validators/schema.js';

export const createShareToken = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const doc = await prisma.document.findFirst({
      where: { id: req.params.documentId, userId: req.user.id },
    });

    if (!doc) return res.status(404).json({ error: 'Document not found' });

    const share = await prisma.shareToken.create({
      data: {
        documentId: doc.id,
      },
    });

    return res.status(201).json({ token: share.token });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const revokeShareToken = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const doc = await prisma.document.findFirst({
      where: { id: req.params.documentId, userId: req.user.id },
    });

    if (!doc) return res.status(404).json({ error: 'Document not found' });

    await prisma.shareToken.deleteMany({
      where: { documentId: doc.id },
    });

    return res.status(200).json({ message: 'Share link revoked successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const getSharedDocument = async (req: Request, res: Response) => {
  try {
    const share = await prisma.shareToken.findUnique({
      where: { token: req.params.shareId },
      include: {
        document: {
          include: {
            analysis: true,
          },
        },
      },
    });

    if (!share) {
      return res.status(404).json({ error: 'Shared link not found or expired' });
    }

    return res.status(200).json({ document: share.document });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const chatOnSharedDocument = async (req: Request, res: Response) => {
  try {
    const parse = messageSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: parse.error.errors[0]?.message || 'Invalid message context' });
    }

    const { content } = parse.data;
    const share = await prisma.shareToken.findUnique({
      where: { token: req.params.shareId },
    });

    if (!share) {
      return res.status(404).json({ error: 'Shared link not found or expired' });
    }

    const documentId = share.documentId;

    // Temporary session chat: load history but do not require user Auth
    const history = await prisma.chatMessage.findMany({
      where: { documentId },
      orderBy: { createdAt: 'asc' },
      take: 20,
    });

    const formattedHistory = history.map((h) => ({
      role: h.role === 'USER' ? 'user' as const : 'assistant' as const,
      content: h.content,
    }));

    // Setup SSE Headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const { answer, citations } = await runChatPipeline(
      documentId,
      content,
      formattedHistory,
      (token) => {
        res.write(`data: ${JSON.stringify({ token })}\n\n`);
      }
    );

    // Save public chat event records to preserve RAG context history for the shared viewer
    await prisma.chatMessage.create({
      data: {
        documentId,
        role: 'USER',
        content,
      },
    });

    await prisma.chatMessage.create({
      data: {
        documentId,
        role: 'ASSISTANT',
        content: answer,
        citations: citations as any,
      },
    });

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err: any) {
    console.error('Shared chat error:', err);
    if (!res.headersSent) {
      return res.status(500).json({ error: err.message || 'Stream processing failed' });
    }
    res.end();
  }
};
