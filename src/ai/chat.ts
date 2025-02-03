import { prebuiltAppConfig, type InitProgressReport } from '@mlc-ai/web-llm';
import { create } from 'zustand';

const enginePromise = (async () => {
  const { CreateWebWorkerMLCEngine } = await import('@mlc-ai/web-llm');
  return CreateWebWorkerMLCEngine(
    new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' }),
    'Llama-3.2-1B-Instruct-q4f16_1-MLC',
    {
      initProgressCallback: progress => useMLCEngine.setState({ latestInitProgress: progress }),
      appConfig: {
        ...prebuiltAppConfig,
        useIndexedDBCache: true,
      },
    },
  );
})();

export const useMLCEngine = create<{
  latestInitProgress: InitProgressReport | undefined;
}>(() => ({
  latestInitProgress: undefined,
}));

export const getChat = async () => (await enginePromise).chat;
