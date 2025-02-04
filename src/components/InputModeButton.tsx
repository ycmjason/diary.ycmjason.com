import type { ReactNode } from 'react';

import KeyboardIcon from '../assets/icons/keyboard.svg?react';
import FreehandIcon from '../assets/icons/freehand.svg?react';
import { toggleInputMode, useAppStore } from '../store/AppStore';

export const InputModeButton = (): ReactNode => {
  const inputMode = useAppStore(({ inputMode }) => inputMode);
  return (
    <button
      onClick={toggleInputMode}
      className="rounded-md bg-amber-200 p-2 text-amber-800 shadow hover:bg-amber-200/90"
      type="button"
    >
      {
        {
          keyboard: (
            <KeyboardIcon
              aria-label="keyboard mode on, click to enable handwriting mode"
              className="h-4 w-4"
            />
          ),
          handwriting: (
            <FreehandIcon
              aria-label="handwriting mode on, click to enable keyboard mode"
              className="h-4 w-4"
            />
          ),
        }[inputMode]
      }
    </button>
  );
};
