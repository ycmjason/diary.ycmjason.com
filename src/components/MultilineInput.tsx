import {
  useState,
  useRef,
  useEffect,
  type ReactNode,
  type KeyboardEventHandler,
  type HTMLAttributes,
} from 'react';
import { clsx } from '../utils/clsx';

export const MultilineInput = ({
  onSubmit,
  readonly = false,
  className,
  textareaProps = {},
  ...props
}: {
  onSubmit: (text: string) => void;
  readonly?: boolean;
  textareaProps?: HTMLAttributes<HTMLTextAreaElement>;
} & Omit<HTMLAttributes<HTMLDivElement>, 'onSubmit'>): ReactNode => {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (onSubmit) onSubmit(value);
      setValue(''); // Clear textarea after submission
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: value changes the scrollHeight
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [value]);

  return (
    <div
      ref={containerRef}
      className={clsx(
        'flex h-full w-full items-center justify-center rounded-md border p-2 text-center',
        !readonly && 'focus-within:ring focus-within:ring-amber-600',
        className,
      )}
      onClick={() => textareaRef.current?.focus()}
      {...props}
    >
      <textarea
        readOnly={readonly}
        ref={textareaRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type something..."
        rows={1}
        style={{ minHeight: '40px' }}
        {...textareaProps}
        className={clsx(
          'w-full resize-none overflow-hidden bg-transparent outline-none',
          textareaProps.className,
        )}
        enterKeyHint="send"
      />
    </div>
  );
};
