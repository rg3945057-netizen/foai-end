import { createContext, useContext, useState, useCallback } from 'react';
import { askAI } from '@/api/aiApi';
import { getItem, setItem } from '@/utils/cache';
import { LS_KEYS, MAX_CHAT_MESSAGES } from '@/constants';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState(() => getItem(LS_KEYS.CHAT_MESSAGES, []));
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  const persistMessages = useCallback((msgs) => {
    const toStore = msgs.slice(-MAX_CHAT_MESSAGES);
    setItem(LS_KEYS.CHAT_MESSAGES, toStore);
    return toStore;
  }, []);

  const sendMessage = useCallback(async (text, dashboardContext) => {
    if (!text.trim()) return;
    setError(null);

    const userMsg = { id: Date.now(), role: 'user', content: text, timestamp: new Date().toISOString() };
    setMessages((prev) => {
      const updated = [...prev, userMsg];
      persistMessages(updated);
      return updated;
    });

    setIsTyping(true);
    try {
      const reply = await askAI(text, dashboardContext);
      const botMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => {
        const updated = persistMessages([...prev, botMsg]);
        return updated;
      });
    } catch (err) {
      const errMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please check your API token and try again.',
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => {
        const updated = persistMessages([...prev, errMsg]);
        return updated;
      });
      setError(err.message);
    } finally {
      setIsTyping(false);
    }
  }, [persistMessages]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setItem(LS_KEYS.CHAT_MESSAGES, []);
  }, []);

  const toggleChat = useCallback(() => setIsOpen((prev) => !prev), []);
  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);

  return (
    <ChatContext.Provider
      value={{ messages, isOpen, isTyping, error, sendMessage, clearChat, toggleChat, openChat, closeChat }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be used within ChatProvider');
  return ctx;
}
