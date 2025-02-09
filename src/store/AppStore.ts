import { create } from 'zustand';
import { streamText } from '../ai/streamText';

export const useAppStore = create<{
  inputMode: 'keyboard' | 'handwriting';
  replyMessage: string | undefined;
  isReplying: boolean;
}>(() => ({
  inputMode: 'handwriting',
  replyMessage: undefined,
  isReplying: false,
}));

export const toggleInputMode = (): void => {
  useAppStore.setState(({ inputMode }) => ({
    inputMode: (
      {
        keyboard: 'handwriting',
        handwriting: 'keyboard',
      } as const
    )[inputMode],
  }));
};

export const submitPromptAndStream = async (prompt: string): Promise<{ modelId: string }> => {
  useAppStore.setState({ isReplying: true });
  const { textStream, finishReason, modelId } = await streamText(prompt);

  for await (const chunk of textStream) {
    useAppStore.setState(state => ({
      replyMessage: `${state.replyMessage ?? ''}${chunk}`,
    }));
  }

  if ((await finishReason) === 'length') {
    useAppStore.setState(state => ({
      replyMessage: `${state.replyMessage ?? ''}...\n\nWell, there's too much I have to say about it.`,
    }));
  }

  useAppStore.setState({ isReplying: false });
  return { modelId };
};
