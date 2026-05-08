import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';
import { Button } from './Button';

export function ErrorState({ message, onRetry, title = 'Something went wrong' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 flex flex-col items-center justify-center text-center gap-4"
    >
      <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20">
        <AlertTriangle size={28} className="text-red-400" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
        {message && (
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">{message}</p>
        )}
      </div>
      {onRetry && (
        <Button variant="ghost" icon={RefreshCw} onClick={onRetry} size="sm">
          Try Again
        </Button>
      )}
    </motion.div>
  );
}

export function NetworkError({ onRetry }) {
  return (
    <ErrorState
      title="Connection Lost"
      message="Unable to reach the server. Check your internet connection."
      onRetry={onRetry}
    />
  );
}

export function ApiKeyError({ service }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 flex flex-col items-center justify-center text-center gap-4"
    >
      <div className="p-4 rounded-full bg-yellow-500/10 border border-yellow-500/20">
        <WifiOff size={28} className="text-yellow-400" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">API Key Required</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
          Add your <code className="text-cyan-400 font-mono text-xs">{service}</code> to the{' '}
          <code className="text-cyan-400 font-mono text-xs">.env</code> file to enable this feature.
        </p>
      </div>
    </motion.div>
  );
}
