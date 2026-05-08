import { useChatContext } from '@/context/ChatContext';

/**
 * Convenience hook to access chatbot state and actions.
 */
export function useChatbot() {
  return useChatContext();
}
