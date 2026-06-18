import fs from 'fs';
import pdfParse from 'pdf-parse';
import { prisma } from '../lib/prisma.js';
import { generateEmbedding } from './embeddingService.js';
import { generateSummary } from './summaryService.js';
import { extractStructuredData } from './extractionService.js';

/**
 * Text splitter that creates overlapping tokens
 */
function chunkText(text: string, chunkSize = 512, overlap = 50): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  
  let i = 0;
  while (i < words.length) {
    const chunkWords = words.slice(i, i + chunkSize);
    chunks.push(chunkWords.join(' '));
    i += chunkSize - overlap;
  }
  
  return chunks.filter(c => c.trim().length > 0);
}

export const processDocument = async (documentId: string) => {
  try {
    const doc = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!doc) {
      console.error(`Document not found to process: ${documentId}`);
      return;
    }

    // Update status to PROCESSING
    await prisma.document.update({
      where: { id: documentId },
      data: { status: 'PROCESSING' },
    });

    // Extract text from PDF
    const fileBuffer = fs.readFileSync(doc.filePath);
    
    // Parse PDF
    const parsedPdf = await pdfParse(fileBuffer);
    const fullText = parsedPdf.text;
    const pageCount = parsedPdf.numpages || 1;

    // Update document pageCount
    await prisma.document.update({
      where: { id: documentId },
      data: { pageCount },
    });

    // Chunk text
    const textChunks = chunkText(fullText);

    // Save and compute embeddings
    for (let index = 0; index < textChunks.length; index++) {
      const content = textChunks[index] || '';
      const embedding = await generateEmbedding(content);

      // Determine approximate page number from character length
      // In production, we'd map PDF text coordinates to pages.
      // Here, we distribute chunks evenly across the pageCount.
      const pageIndex = Math.min(
        Math.floor((index / textChunks.length) * pageCount) + 1,
        pageCount
      );

      const chunk = await prisma.documentChunk.create({
        data: {
          documentId,
          content,
          pageNumber: pageIndex,
          chunkIndex: index,
        },
      });

      // Update vector embedding in DB using raw query
      const embeddingString = `[${embedding.join(',')}]`;
      await prisma.$executeRawUnsafe(
        `UPDATE "DocumentChunk" SET embedding = $1::vector WHERE id = $2`,
        embeddingString,
        chunk.id
      );
    }

    // Generate AI Summary & Key Insights
    const analysis = await generateSummary(fullText);

    // Extract structured entities
    const extractedData = await extractStructuredData(fullText, analysis.documentType);

    // Save Analysis details
    await prisma.documentAnalysis.create({
      data: {
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

    // Finalize status
    await prisma.document.update({
      where: { id: documentId },
      data: { status: 'READY' },
    });

    console.log(`Document processing complete: ${doc.title}`);
  } catch (err) {
    console.error(`Document processing failed for ${documentId}:`, err);
    await prisma.document.update({
      where: { id: documentId },
      data: { status: 'FAILED' },
    });
  }
};
