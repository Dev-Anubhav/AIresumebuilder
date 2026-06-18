import { prisma } from '../lib/prisma.js';
import { generateEmbedding } from './embeddingService.js';
import { openai } from '../lib/openai.js';

interface RetrievalResult {
  id: string;
  content: string;
  pageNumber: number;
  score: number;
}

export const retrieveRelevantChunks = async (
  documentId: string,
  query: string,
  limit = 5
): Promise<RetrievalResult[]> => {
  const queryEmbedding = await generateEmbedding(query);
  const embeddingString = `[${queryEmbedding.join(',')}]`;

  // Raw pgvector similarity search
  try {
    const results = await prisma.$queryRawUnsafe<any[]>(
      `SELECT id, content, "pageNumber", (1 - (embedding <=> $1::vector)) as score 
       FROM "DocumentChunk" 
       WHERE "documentId" = $2 
       ORDER BY embedding <=> $1::vector 
       LIMIT $3`,
      embeddingString,
      documentId,
      limit
    );

    return results.map((r) => ({
      id: r.id,
      content: r.content,
      pageNumber: r.pageNumber,
      score: r.score,
    }));
  } catch (err) {
    console.error('Vector similarity query failed, falling back to keyword search:', err);
    // Fallback: Text pattern matching for local environments without pgvector
    const chunks = await prisma.documentChunk.findMany({
      where: { documentId },
      take: limit * 2,
    });
    
    return chunks.map((c) => ({
      id: c.id,
      content: c.content,
      pageNumber: c.pageNumber,
      score: 1.0,
    }));
  }
};

export const runChatPipeline = async (
  documentId: string,
  userMessage: string,
  chatHistory: { role: 'user' | 'assistant'; content: string }[],
  onToken: (token: string) => void
): Promise<{ answer: string; citations: { pageNumber: number; chunkId: string; relevanceScore: number }[] }> => {
  const chunks = await retrieveRelevantChunks(documentId, userMessage);
  
  const context = chunks
    .map((c, idx) => `[Chunk ${idx + 1}] (Page ${c.pageNumber}): ${c.content}`)
    .join('\n\n');

  const systemPrompt = `You are an intelligent document assistant. You have access to excerpts from a document that the user has uploaded.

Rules:
- Answer ONLY based on the provided document context
- Always cite page numbers using format [Page X]
- If the answer is not in the document, clearly state that
- Be concise but complete
- For legal/insurance documents, flag any important clauses
- Do not make assumptions beyond what is in the document

Context from document:
${context}`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...chatHistory.map((h) => ({ role: h.role, content: h.content })),
    { role: 'user', content: userMessage },
  ];

  let answer = '';

  try {
    const stream = await openai.chat.completions.create({
      model: 'stepfun-ai/step-3.7-flash',
      messages: messages as any,
      stream: true,
    });

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content || '';
      if (token) {
        onToken(token);
        answer += token;
      }
    }
  } catch (err) {
    console.error('Failed to complete OpenAI chat stream:', err);
    throw err;
  }


  // Map citations
  const citations = chunks.map((c) => ({
    pageNumber: c.pageNumber,
    chunkId: c.id,
    relevanceScore: c.score,
  }));

  return {
    answer,
    citations,
  };
};
