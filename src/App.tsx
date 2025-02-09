import type { ReactNode } from 'react';
import { Faded } from './components/Faded';
import { OCRCanvasWithTimeout } from './components/OCRCanvasWithTimeout';
import { VintagePaper } from './components/VintagePaper';
import { InputModeButton } from './components/InputModeButton';
import { submitPromptAndStream, useAppStore } from './store/AppStore';
import { MultilineInput } from './components/MultilineInput';
import { AnimatePresence } from 'motion/react';
import posthog from 'posthog-js';

const REPLY_FADE_DURATION = 800;

function App(): ReactNode {
  const { isReplying, replyMessage, inputMode } = useAppStore();

  const onSubmit = async (prompt: string) => {
    const { modelId } = await submitPromptAndStream(prompt);
    posthog.capture('submit llm', {
      modelId,
      prompt,
      inputMode,
      response: useAppStore.getState().replyMessage,
    });
  };

  return (
    <div className="mx-auto flex min-h-svh max-w-6xl flex-col items-center gap-4 p-4">
      <VintagePaper className="relative flex h-[calc(100svh-2rem)] max-h-[calc(1.4141*(100lvw-2rem))] flex-col">
        <div className="m-4">
          <h1>YCMJason's Diary</h1>
          <div className="text-xs">
            (Disclaimer: Information is most probably wrong. Opinions are not my own. Do not trust
            the diary!)
          </div>
        </div>
        <div
          className="relative grow overflow-y-auto"
          style={{ scrollbarColor: 'rgba(50, 50, 50, 0.7) transparent' }}
        >
          <AnimatePresence mode="wait">
            {replyMessage === undefined && !isReplying ? (
              <Faded key="input" duration={REPLY_FADE_DURATION} className="h-full w-full">
                {
                  {
                    handwriting: (
                      <div className="h-full w-full">
                        <OCRCanvasWithTimeout
                          readonly={isReplying || replyMessage !== undefined}
                          className="h-full w-full"
                          timeout={1500}
                          onRecognized={({ text }) => onSubmit(text)}
                        />
                      </div>
                    ),
                    keyboard: (
                      <div className="h-full px-4">
                        {!isReplying && replyMessage === undefined && (
                          <MultilineInput
                            onSubmit={text => onSubmit(text)}
                            className="h-full w-full rounded border"
                            textareaProps={{
                              className:
                                'text-center font-(family-name:--font-family-cursive) text-amber-800 font-bold text-2xl',
                            }}
                          />
                        )}
                      </div>
                    ),
                  }[inputMode]
                }
              </Faded>
            ) : (
              <Faded
                key="response"
                tabIndex={0}
                onClick={() => {
                  if (isReplying) return;
                  useAppStore.setState({ replyMessage: undefined });
                }}
                duration={REPLY_FADE_DURATION}
                className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-6 p-4 text-center text-amber-800"
              >
                <p className="font-(family-name:--font-family-cursive) whitespace-pre-wrap text-2xl">
                  {replyMessage}
                </p>
              </Faded>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-auto flex w-full items-end p-4">
          <InputModeButton />
          <Faded duration={REPLY_FADE_DURATION} className="ml-auto">
            {replyMessage && <p className="text-sm">(Click anywhere to continue...)</p>}
          </Faded>
        </div>
      </VintagePaper>
    </div>
  );
}

export default App;
