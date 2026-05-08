import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { ISSProvider } from "@/context/ISSContext";
import { NewsProvider } from "@/context/NewsContext";
import { ChatProvider } from "@/context/ChatContext";
import "leaflet/dist/leaflet.css";
import App from "./App";
import "@/styles/globals.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ISSProvider>
          <NewsProvider>
            <ChatProvider>
              <App />
            </ChatProvider>
          </NewsProvider>
        </ISSProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);

// Startup environment validation (safe, non-throwing)
(() => {
  const missing = [];
  if (!import.meta.env.VITE_NEWS_API_KEY) missing.push("VITE_NEWS_API_KEY");
  if (!import.meta.env.VITE_AI_TOKEN) missing.push("VITE_AI_TOKEN");

  if (missing.length) {
    console.warn(
      `[env] Missing environment variables: ${missing.join(", ")}.\n` +
        "Add them to a top-level `.env` file and restart Vite.",
    );
  }

  // Expose for optional runtime checks in the UI (non-sensitive)
  window.__ENV_VALIDATION__ = { missing };
})();
