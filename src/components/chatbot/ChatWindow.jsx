import { useRef, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Trash2, Send, Bot, Info } from 'lucide-react';
import { useChatbot } from '@/hooks/useChatbot';
import { useISSData } from '@/hooks/useISSData';
import { useNews } from '@/hooks/useNews';
import { ChatMessage, TypingIndicator } from './ChatMessage';

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content: `👋 Hi! I'm your ISS Dashboard assistant.\n\nI can answer questions about:\n- **ISS position** (lat, lon, altitude, speed)\n- **Astronauts** currently in space\n- **News** articles loaded in the dashboard\n\nI only use current dashboard data — no outside knowledge.`,
  timestamp: new Date().toISOString(),
};

const SUGGESTIONS = [
  'Where is the ISS right now?',
  'How fast is the ISS moving?',
  'How many people are in space?',
  'What are the top news headlines?',
];

export function ChatWindow() {
  const { messages, isOpen, isTyping, sendMessage, clearChat, closeChat } = useChatbot();
  const { position, speeds, astronauts, region } = useISSData();
  const { articles } = useNews();
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Build dashboard context for AI
  const buildContext = () => ({
    iss: position
      ? {
          latitude: position.latitude,
          longitude: position.longitude,
          altitude: position.altitude,
          speed: speeds?.[speeds.length - 1]?.speed || position.velocity,
          region,
          lastUpdated: new Date().toISOString(),
        }
      : null,
    astronauts: astronauts
      ? {
          count: astronauts.number,
          names: astronauts.people?.map((p) => `${p.name} (${p.craft})`),
        }
      : null,
    news: articles?.length
      ? {
          count: articles.length,
          headlines: articles.slice(0, 8).map((a) => a.title),
          sources: [...new Set(articles.map((a) => a.source?.name).filter(Boolean))],
        }
      : null,
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 200);
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    sendMessage(input.trim(), buildContext());
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const displayMessages = messages.length === 0 ? [WELCOME_MESSAGE] : messages;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="chat-window"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-20 lg:bottom-6 right-4 z-50 w-[min(380px,calc(100vw-2rem))] flex flex-col"
          style={{ maxHeight: 'calc(100vh - 8rem)' }}
          role="dialog"
          aria-label="AI Chatbot"
        >
          <div className="glass-card flex flex-col overflow-hidden shadow-glow-cyan h-full" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 flex-shrink-0">
              <div className="p-1.5 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
                <Bot size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">ISS Assistant</p>
                <p className="text-xs text-gray-400">Dashboard-only knowledge</p>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={clearChat}
                    className="btn-icon text-gray-400 hover:text-red-400"
                    aria-label="Clear chat"
                    title="Clear chat"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
                <button
                  onClick={closeChat}
                  className="btn-icon text-gray-400 hover:text-gray-200"
                  aria-label="Close chat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {displayMessages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions (shown when empty) */}
            {messages.length === 0 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setInput(s); inputRef.current?.focus(); }}
                    className="text-xs px-2.5 py-1 rounded-full border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-3 border-t border-white/10 flex gap-2 flex-shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about ISS or news..."
                className="flex-1 text-sm bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                disabled={isTyping}
                maxLength={300}
                aria-label="Chat message input"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-glow-cyan transition-all active:scale-95"
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </div>

            {/* Disclaimer */}
            <div className="px-4 pb-2.5 flex items-center gap-1 flex-shrink-0">
              <Info size={10} className="text-gray-400 flex-shrink-0" />
              <p className="text-[10px] text-gray-500">Powered by Mistral-7B · Dashboard data only</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
