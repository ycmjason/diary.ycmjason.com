import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import SYSTEM_PROMPT from './SYSTEM_PROMPT?raw';
import * as ai from 'ai';
import posthog from 'posthog-js';

const PREFERRED_MODEL_ID = 'google/gemini-2.0-flash-lite-preview-02-05:free';

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

const getModelId = async (): Promise<string> => {
  const preferredModelResponse = await fetch(
    `https://openrouter.ai/api/v1/models/${PREFERRED_MODEL_ID}/endpoints`,
  );
  if (preferredModelResponse.ok) {
    await preferredModelResponse.body?.cancel();
    return PREFERRED_MODEL_ID;
  }

  posthog.capture('preferred model missing');
  const res = await fetch('https://openrouter.ai/api/v1/models');
  const { data: models }: { data: OpenRouterModelDescriptor[] } = await res.json();
  const [fallbackModel] = models
    .filter(({ pricing }) => Object.values(pricing).every(price => price === '0'))
    .sort((m1, m2) => m2.created - m1.created);

  if (!fallbackModel) {
    posthog.capture('no free model');
    alert('Cannot find free LLM models! 😭 Sorry, diary not working right now!');
    throw new Error('No free model');
  }

  return fallbackModel.id;
};

const modelIdPromise = getModelId();

export const streamText = async (
  prompt: string,
): Promise<ReturnType<typeof ai.streamText> & { modelId: string }> => {
  const modelId = await modelIdPromise;

  return Object.assign(
    ai.streamText({
      model: openrouter(modelId),
      temperature: 0.7,
      system: `Today's date: ${new Date().toISOString()}\n${SYSTEM_PROMPT}`,
      prompt,
      maxTokens: 100,
    }),
    { modelId },
  );
};
