import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { PostHogProvider } from 'posthog-js/react';

createRoot(
  document.getElementById('root') ??
    (() => {
      throw new Error('Cannot find root.');
    })(),
).render(
  <StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.VITE_POSTHOG_KEY}
      options={{
        api_host: import.meta.env.VITE_POSTHOG_HOST,
        person_profiles: 'always',
      }}
    >
      <App />
    </PostHogProvider>
  </StrictMode>,
);
