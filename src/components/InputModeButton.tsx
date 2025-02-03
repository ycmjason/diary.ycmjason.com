import type { ReactNode } from 'react';

import KeyboardIcon from '../assets/keyboard.svg?react';

export const InputModeButton = (): ReactNode => {
  return (
    <button
      className="absolute bottom-4 left-4 rounded-md bg-amber-200 p-2 text-amber-800 shadow hover:bg-amber-200/90"
      type="button"
    >
      <KeyboardIcon aria-label="use keyboard" className="h-4 w-4" />
    </button>
  );
};
