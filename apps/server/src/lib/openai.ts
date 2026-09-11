import OpenAI from 'openai';

const apiKey = process.env.NVIDIA_API_KEY || '';

export const openai = new OpenAI({
  apiKey,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

