import { create } from 'zustand';

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
