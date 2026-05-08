import { clsx } from 'clsx';

const variants = {
  cyan: 'badge-cyan',
  green: 'badge-green',
  yellow: 'badge-yellow',
  red: 'badge-red',
  default: 'badge bg-gray-500/20 text-gray-400 border border-gray-500/30',
};

export function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={clsx(variants[variant] || variants.default, className)}>
      {children}
    </span>
  );
}
