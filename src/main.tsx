
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  async function start() {
    if (import.meta.env.DEV) {
      const { worker } = await import('./mocks/browser');
      await worker.start({ onUnhandledRequest: 'bypass' });
      console.log('MSW worker started (dev)');
    }
    createRoot(document.getElementById("root")!).render(<App />);
  }

  start();
  