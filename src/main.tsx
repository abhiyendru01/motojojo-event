
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create error boundary for the application
const renderApp = () => {
  try {
    createRoot(document.getElementById("root")!).render(<App />);
  } catch (error) {
    console.error("Failed to render the app:", error);
    
    // Fallback render in case of critical errors
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center; font-family: sans-serif;">
          <h1>Application Error</h1>
          <p>Sorry, there was a problem loading the application.</p>
          <p>Please try refreshing the page or contact support if the issue persists.</p>
        </div>
      `;
    }
  }
};

renderApp();
