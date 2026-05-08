import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { ISSProvider } from '@/context/ISSContext';
import { NewsProvider } from '@/context/NewsContext';
import { ChatProvider } from '@/context/ChatContext';
import 'leaflet/dist/leaflet.css'
import App from './App';
import '@/styles/globals.css';

createRoot(document.getElementById('root')).render(
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
  </StrictMode>
);
