import { openai } from '../lib/openai.js';

export const generateEmbedding = async (text: string): Promise<number[]> => {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith('mock')) {
    // Generate a deterministically reproducible mock embedding for offline testing/compilation
    const vec: number[] = [];
    for (let i = 0; i < 1536; i++) {
      let code = text.charCodeAt(i % text.length) || 0;
      vec.push(Math.sin(code + i) * 0.1);
    }
    return vec;
  }

  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    return response.data[0]?.embedding || [];
  } catch (err) {
    console.error('Failed to generate embedding from OpenAI:', err);
    throw err;
  }
};
