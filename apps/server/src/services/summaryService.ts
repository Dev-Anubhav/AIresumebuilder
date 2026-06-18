import { openai } from '../lib/openai.js';

interface SummaryResult {
  summary: string;
  keyInsights: string[];
  documentType: string;
  language: string;
  sentiment: string;
  riskFlags: string[];
}

export const generateSummary = async (text: string): Promise<SummaryResult> => {
  try {
    const response = await openai.chat.completions.create({
      model: 'stepfun-ai/step-3.7-flash',

      messages: [
        {
          role: 'system',
          content: `You are an expert document analyst. Analyze the provided text and output a JSON object containing:
1. summary (2-3 paragraphs executive summary)
2. keyInsights (5-7 bullet points string[])
3. documentType (classification e.g. "contract", "report", "insurance", "research")
4. language (detected language)
5. sentiment (sentiment analysis)
6. riskFlags (warning issues found, string[])

Format your response strictly as valid JSON matching this schema.`
        },
        {
          role: 'user',
          content: text.substring(0, 40000),
        }
      ],
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content || '{}';
    return JSON.parse(content) as SummaryResult;
  } catch (err) {
    console.error('Failed to generate summary:', err);
    throw err;
  }
};
