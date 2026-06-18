import OpenAI from 'openai';

const apiKey = process.env.NVIDIA_API_KEY || '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';

export const openai = new OpenAI({
  apiKey,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

