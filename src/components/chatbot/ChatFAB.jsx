import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X } from 'lucide-react';
import { useChatbot } from '@/hooks/useChatbot';

export function ChatFAB() {
  const { isOpen, toggleChat, messages } = useChatbot();
  const unread = messages.filter((m) => m.role === 'assistant').length;

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 z-50">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleChat}
            className="relative w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-glow-cyan flex items-center justify-center text-white"
            aria-label="Open AI Chatbot"
          >
            <Bot size={24} />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-cyan-500/30 animate-ping" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
