import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export function Card({ children, className = '', hover = true, glow = false, ...props }) {
  return (
    <motion.div
      className={clsx(
        'glass-card p-4 md:p-6',
        hover && 'hover:border-cyan-500/30 hover:shadow-glow-sm transition-all duration-300',
        glow && 'shadow-glow-cyan',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ title, subtitle, icon: Icon, action, className = '' }) {
  return (
    <div className={clsx('flex items-start justify-between mb-4', className)}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <Icon size={18} className="text-cyan-400" />
          </div>
        )}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
