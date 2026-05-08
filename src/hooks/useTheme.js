import { useThemeContext } from '@/context/ThemeContext';

/**
 * Convenience hook to access theme state.
 */
export function useTheme() {
  return useThemeContext();
}
