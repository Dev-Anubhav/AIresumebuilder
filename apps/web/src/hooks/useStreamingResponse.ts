import { useState } from 'react';

export const useStreamingResponse = () => {
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const stream = async (url: string, body: object) => {
    setIsStreaming(true);
    setStreamingText('');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Streaming request failed');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Failed to retrieve readable stream reader');
      }

      let buffer = '';
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Keep the last partial line in buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          const cleanLine = line.trim();
          if (!cleanLine || !cleanLine.startsWith('data:')) continue;
          
          const rawData = cleanLine.substring(5).trim();
          if (rawData === '[DONE]') {
            setIsStreaming(false);
            return accumulatedText;
          }

          try {
            const parsed = JSON.parse(rawData);
            if (parsed.token) {
              accumulatedText += parsed.token;
              setStreamingText(accumulatedText);
            }
          } catch (err) {
            console.error('Failed to parse SSE data token:', rawData, err);
          }
        }
      }
      return accumulatedText;
    } catch (err) {
      console.error('Streaming hook failed:', err);
      return '';
    } finally {
      setIsStreaming(false);
    }
  };

  return { streamingText, isStreaming, stream, setStreamingText };
};

