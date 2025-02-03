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
