import { Queue, Worker } from 'bullmq';
import { redis } from './redis.js';
import { processDocument } from '../services/documentService.js';

export const documentQueue = new Queue('document-processing', {
  connection: redis as any,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  },
});

// Setup Worker to process jobs
const worker = new Worker(
  'document-processing',
  async (job) => {
    const { documentId } = job.data;
    console.log(`Processing document job for: ${documentId}`);
    await processDocument(documentId);
  },
  {
    connection: redis as any,
  }
);


worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully for document: ${job.data.documentId}`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed with error:`, err);
});
