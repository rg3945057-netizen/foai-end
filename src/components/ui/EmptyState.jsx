import { motion } from 'framer-motion';
import { Inbox, SearchX, Newspaper } from 'lucide-react';

const icons = {
  default: Inbox,
  search: SearchX,
  news: Newspaper,
};

export function EmptyState({ title = 'Nothing here yet', message, type = 'default', action }) {
  const Icon = icons[type] || icons.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-10 flex flex-col items-center justify-center text-center gap-4"
    >
      <div className="p-4 rounded-full bg-cyan-500/10 border border-cyan-500/20">
        <Icon size={28} className="text-cyan-400" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
        {message && (
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">{message}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </motion.div>
  );
}
