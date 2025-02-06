import { type HTMLAttributes, useRef, useState } from 'react';
import { clsx } from '../utils/clsx';
import { OCRCanvas } from './OCRCanvas';

export const OCRCanvasWithTimeout = ({
  timeout,
  onRecognized,
  className,
  readonly,
  ...props
}: {
  timeout: number;
  onRecognized: (e: { text: string }) => void;
  readonly?: boolean;
} & HTMLAttributes<HTMLCanvasElement>) => {
  const [isDrawEnded, setIsEnded] = useState(false);
  const debounceAbortControllerRef = useRef<AbortController>(null);
  const transitionEndHandlerRef = useRef<() => void>(null);

  return (
    <OCRCanvas
      readonly={readonly}
      onTransitionEnd={() => {
        transitionEndHandlerRef.current?.();
      }}
      onDrawStart={() => {
        setIsEnded(false);
        debounceAbortControllerRef.current?.abort();
      }}
      onDrawEnd={({ canvasController }) => {
        setIsEnded(true);

        const abortController = new AbortController();
        debounceAbortControllerRef.current?.abort();
        debounceAbortControllerRef.current = abortController;

        transitionEndHandlerRef.current = async () => {
          // important to clear the transitionEndHandlerRef first to avoid double firing of this handler
          // this is because transtionEnd fires for each property transition
          transitionEndHandlerRef.current = null;
          if (abortController.signal.aborted) return;
          const text = await canvasController.recognize();
          if (abortController.signal.aborted) return;

          onRecognized({
            text,
          });
          canvasController.clear();
          setIsEnded(false);
        };
      }}
      style={
        isDrawEnded
          ? {
              transitionDuration: `${timeout * 0.4}ms`,
              transitionDelay: `${timeout * 0.6}ms`,
              filter: 'opacity(0) blur(var(--blur-xs)',
            }
          : {
              transitionDuration: '350ms',
              filter: 'opacity(1)',
            }
      }
      className={clsx('transition-filter', className)}
      {...props}
    />
  );
};
