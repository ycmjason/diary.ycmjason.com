import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import SYSTEM_PROMPT from './SYSTEM_PROMPT?raw';
import * as ai from 'ai';

const openrouter = createOpenRouter({
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
});

export const streamText = (prompt: string) =>
  ai.streamText({
    model: openrouter('meta-llama/llama-3.3-70b-instruct:free'),
    temperature: 0.7,
    system: `Today's date: ${new Date().toISOString()}\n${SYSTEM_PROMPT}`,
    prompt,
    maxTokens: 100,
  });
