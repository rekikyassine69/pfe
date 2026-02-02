
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  async function start() {
    if (import.meta.env.DEV) {
      try {
        const { worker } = await import('./mocks/browser');
        await worker.start({ onUnhandledRequest: 'bypass' });
        console.log('MSW worker started (dev)');
      } catch (err) {
        // Don't block the app if MSW fails to start (e.g., SW registration issue)
        console.warn('MSW worker failed to start:', err);
      }
    }
    createRoot(document.getElementById("root")!).render(<App />);
  }

  start();
  