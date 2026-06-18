import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';
import { messageSchema } from '../validators/schema.js';
import { runChatPipeline } from '../services/chatService.js';
import { openai } from '../lib/openai.js';

export const sendChatMessage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const parse = messageSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: parse.error.errors[0]?.message || 'Invalid message context' });
    }

    const { content } = parse.data;
    const { documentId } = req.params;

    // Verify document exists and belongs to user
    const document = await prisma.document.findFirst({
      where: { id: documentId, userId: req.user.id },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Save User message
    await prisma.chatMessage.create({
      data: {
        documentId,
        role: 'USER',
        content,
      },
    });

    // Fetch message history for RAG contexts
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

    // Save assistant message with citations
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
    console.error('Send message error:', err);
    if (!res.headersSent) {
      return res.status(500).json({ error: err.message || 'Stream processing failed' });
    }
    res.end();
  }
};

export const getChatHistory = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const messages = await prisma.chatMessage.findMany({
      where: { documentId: req.params.documentId },
      orderBy: { createdAt: 'asc' },
    });

    return res.status(200).json({ messages });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const clearChatHistory = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    await prisma.chatMessage.deleteMany({
      where: { documentId: req.params.documentId },
    });

    return res.status(200).json({ message: 'Chat history cleared successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const sendGeneralChatMessage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await openai.chat.completions.create({
      model: 'stepfun-ai/step-3.7-flash',
      messages: [
        {
          role: 'system',
          content: 'You are an expert ATS Resume Builder and career coach. Help the user optimize their resume. If proposing specific updates, output them clearly and end your message with a JSON block:\n```json\n{\n  "type": "summary" | "skills",\n  "value": "rewritten summary text" | ["skill1", "skill2"]\n}\n```'
        },
        { role: 'user', content: message }
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content || '';
      if (token) {
        res.write(token);
      }
    }
    res.end();
  } catch (err: any) {
    console.error('General chat error:', err);
    if (!res.headersSent) {
      return res.status(500).json({ error: err.message || 'Stream processing failed' });
    }
    res.end();
  }
};

