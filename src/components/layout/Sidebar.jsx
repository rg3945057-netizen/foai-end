import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Satellite, Newspaper, Bot, Activity } from 'lucide-react';
import { useISSData } from '@/hooks/useISSData';
import { formatCoord } from '@/utils/dateFormat';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/iss', label: 'ISS Tracker', icon: Satellite },
  { path: '/news', label: 'News', icon: Newspaper },
];

export function Sidebar() {
  const { position, speeds } = useISSData();
  const latestSpeed = speeds?.[speeds.length - 1]?.speed;

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen sticky top-16 h-[calc(100vh-4rem)] border-r border-gray-200/50 dark:border-white/10 bg-white/50 dark:bg-space-900/50 backdrop-blur-xl p-4 gap-2 overflow-y-auto">
      {/* Navigation */}
      <nav className="space-y-1">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-2">
          Navigation
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-500 dark:text-cyan-400 border border-cyan-500/20'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={16} className={isActive ? 'text-cyan-400' : ''} />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-200/50 dark:border-white/10 my-2" />

      {/* Live ISS Mini Stats */}
      <div className="space-y-1">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-2">
          Live ISS Data
        </p>

        <div className="glass-card p-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="live-dot" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Real-time</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-400">Latitude</p>
              <p className="text-sm font-mono font-semibold text-cyan-400">
                {position ? formatCoord(position.latitude) : '--'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Longitude</p>
              <p className="text-sm font-mono font-semibold text-cyan-400">
                {position ? formatCoord(position.longitude) : '--'}
              </p>
            </div>
          </div>

          {latestSpeed && (
            <div className="pt-1 border-t border-white/10">
              <p className="text-xs text-gray-400">Speed</p>
              <p className="text-sm font-mono font-semibold text-green-400">
                {latestSpeed.toLocaleString()} km/h
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto">
        <div className="glass-card p-3 text-center">
          <p className="text-xs text-gray-500">ISS Orbit Intelligence</p>
          <p className="text-xs text-gray-400">v1.0.0 · Production</p>
        </div>
      </div>
    </aside>
  );
}
