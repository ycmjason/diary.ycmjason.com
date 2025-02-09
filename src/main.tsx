import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import posthog from 'posthog-js';

if (import.meta.env.PROD) {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST,
    person_profiles: 'always',
  });
}
createRoot(
  document.getElementById('root') ??
    (() => {
      throw new Error('Cannot find root.');
    })(),
).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
