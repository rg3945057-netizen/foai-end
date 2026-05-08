import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Satellite, Newspaper } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/iss', label: 'ISS', icon: Satellite },
  { path: '/news', label: 'News', icon: Newspaper },
];

export function BottomNav() {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-space-900/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-white/10"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-cyan-500 dark:text-cyan-400'
                  : 'text-gray-500 dark:text-gray-500'
              }`
            }
            aria-label={item.label}
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={20}
                  className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}
                />
                <span className="text-[10px] font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
