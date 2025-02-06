import { type ComponentProps, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { PostHogProvider } from 'posthog-js/react';

const posthogConfig: ComponentProps<typeof PostHogProvider> = import.meta.env.PROD
  ? {
      apiKey: import.meta.env.VITE_POSTHOG_KEY,
      options: {
        api_host: import.meta.env.VITE_POSTHOG_HOST,
        person_profiles: 'always',
      },
    }
  : { apiKey: '' };

createRoot(
  document.getElementById('root') ??
    (() => {
      throw new Error('Cannot find root.');
    })(),
).render(
  <PostHogProvider {...posthogConfig}>
    <StrictMode>
      <App />
    </StrictMode>
  </PostHogProvider>,
);
