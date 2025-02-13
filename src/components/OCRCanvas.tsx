import { type HTMLAttributes, useEffect, useRef } from 'react';
import { HandwritingRecognizerCanvasController } from '../handwriting/HandwritingRecognizerCanvasController';
import { useStableCallback } from '../hooks/useStableCallback';
import { clsx } from '../utils/clsx';
import { getRootCSSVariable } from '../utils/getCSSVariable';

export const OCRCanvas = ({
  onDrawStart,
  onDrawEnd,
  className,
  readonly = false,
  ...props
}: {
  onDrawStart?: (e: {
    canvasController: HandwritingRecognizerCanvasController;
  }) => void;
  onDrawEnd?: (e: {
    canvasController: HandwritingRecognizerCanvasController;
  }) => void;
  readonly?: boolean;
} & HTMLAttributes<HTMLCanvasElement>) => {
  const canvasControllerRef = useRef<HandwritingRecognizerCanvasController | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onDrawStartStable = useStableCallback(() => {
    const canvasController = canvasControllerRef.current;
    if (canvasController === null) return;
    onDrawStart?.({ canvasController });
  });
  const onDrawEndStable = useStableCallback(() => {
    const canvasController = canvasControllerRef.current;
    if (canvasController === null) return;
    onDrawEnd?.({ canvasController });
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!(parent instanceof HTMLElement)) return;
    const { width, height } = parent.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;

    canvasControllerRef.current = new HandwritingRecognizerCanvasController(canvas, {
      strokeStyle: getRootCSSVariable('--color-amber-800'),
      onDrawStart: onDrawStartStable,
      onDrawEnd: onDrawEndStable,
    });

    return () => canvasControllerRef.current?.destroy();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={clsx(
        className,
        !readonly && 'cursor-crosshair touch-none',
        readonly && 'pointer-events-none',
      )}
      {...props}
    />
  );
};
