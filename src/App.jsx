import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { ChatFAB } from '@/components/chatbot/ChatFAB';
import { ChatWindow } from '@/components/chatbot/ChatWindow';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { SkeletonCard } from '@/components/ui/Skeleton';

// Lazy-loaded pages for code splitting
const HomePage = lazy(() => import('@/pages/HomePage'));
const ISSPage = lazy(() => import('@/pages/ISSPage'));
const NewsPage = lazy(() => import('@/pages/NewsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function PageLoader() {
  return (
    <div className="p-6 grid gap-4">
      {[1, 2, 3].map((i) => <SkeletonCard key={i} lines={3} />)}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-space-900 transition-colors duration-300">
        {/* Cyber grid background (dark only) */}
        <div className="fixed inset-0 cyber-bg opacity-30 dark:opacity-100 pointer-events-none" />

        <Navbar />

        <div className="flex relative">
          <Sidebar />

          <main className="flex-1 min-w-0 pb-20 lg:pb-6">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/iss" element={<ISSPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </main>
        </div>

        <BottomNav />

        {/* Floating chatbot */}
        <ChatFAB />
        <ChatWindow />

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'rgba(10, 15, 46, 0.95)',
              color: '#e2e8f0',
              border: '1px solid rgba(0, 245, 255, 0.2)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              fontSize: '13px',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#0a0f2e' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#0a0f2e' },
            },
          }}
        />
      </div>
    </ErrorBoundary>
  );
}
