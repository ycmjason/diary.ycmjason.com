import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import SYSTEM_PROMPT from './SYSTEM_PROMPT?raw';
import * as ai from 'ai';
import posthog from 'posthog-js';

const PREFERRED_MODEL = 'google/gemini-2.0-flash-lite-preview-02-05:free';

const openrouter = createOpenRouter({
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
});

type OpenRouterModelDescriptor = {
  id: string;
  name: string;
  created: number;
  description: string;
  context_length: number;
  architecture: {
    modality: 'text->text' | 'text+image->text';
  };
  pricing: {
    prompt: string;
    completion: string;
    image: string;
    request: string;
  };
  top_provider: {
    context_length: number;
    max_completion_tokens: number;
    is_moderated: boolean;
  };
};

const getAvailableModels = async () => {
  const res = await fetch('https://openrouter.ai/api/v1/models');
  const { data: models }: { data: OpenRouterModelDescriptor[] } = await res.json();
  const freeModels = models
    .filter(({ pricing }) => Object.values(pricing).every(price => price === '0'))
    .sort((m1, m2) => m2.created - m1.created);

  const preferredModel = freeModels.find(({ id }) => id === PREFERRED_MODEL);
  if (preferredModel !== undefined) {
    return [preferredModel];
  }

  posthog.capture('preferred model missing');

  return freeModels;
};

const availableModelsPromise = getAvailableModels();

export const streamText = async (
  prompt: string,
): Promise<ReturnType<typeof ai.streamText> & { modelId: string }> => {
  const [model] = await availableModelsPromise;
  if (!model) {
    alert('cannot find free LLM models :( sorry diary not working');
    throw new Error('No free model');
  }

  return Object.assign(
    ai.streamText({
      model: openrouter(model.id),
      temperature: 0.7,
      system: `Today's date: ${new Date().toISOString()}\n${SYSTEM_PROMPT}`,
      prompt,
      maxTokens: 100,
    }),
    { modelId: model.id },
  );
};
