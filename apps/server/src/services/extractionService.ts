import { openai } from '../lib/openai.js';

export const extractStructuredData = async (text: string, documentType: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'stepfun-ai/step-3.7-flash',

      messages: [
        {
          role: 'system',
          content: `You are an expert data extraction bot. Extract key structural elements from the provided document context.
Extract fields and map them to standard categories: 'Dates', 'Parties', 'Amounts', 'Clauses', 'Terms'.
Output the result ONLY as a JSON array of objects following this TypeScript definition:
interface ExtractedField {
  field: string;
  value: string;
  pageReference: string; // e.g. "1" or "3"
  confidence: number; // float between 0 and 1
  category: 'Dates' | 'Parties' | 'Amounts' | 'Clauses' | 'Terms';
}`
        },
        {
          role: 'user',
          content: `Document Type: ${documentType}\n\nDocument text: ${text.substring(0, 40000)}`
        }
      ],
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);
    // Return array if nested or root
    if (Array.isArray(parsed)) return parsed;
    if (parsed.extractedData && Array.isArray(parsed.extractedData)) return parsed.extractedData;
    if (parsed.fields && Array.isArray(parsed.fields)) return parsed.fields;
    return Object.values(parsed)[0] || [];
  } catch (err) {
    console.error('Structured data extraction failed:', err);
    return [];
  }
};
