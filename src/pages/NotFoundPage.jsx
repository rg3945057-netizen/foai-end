import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Satellite } from 'lucide-react';

export default function NotFoundPage() {
  useEffect(() => {
    document.title = '404 — ISS Orbit Intelligence';
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-10 max-w-md w-full text-center space-y-5"
      >
        {/* Animated satellite */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center"
        >
          <Satellite size={36} className="text-cyan-400" />
        </motion.div>

        <div>
          <h1 className="text-5xl font-bold text-gradient-cyan font-mono mb-2">404</h1>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Lost in Orbit
          </h2>
          <p className="text-sm text-gray-400">
            The page you're looking for has drifted out of range. Let's get you back to mission control.
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn-primary flex items-center gap-1.5">
            <Home size={14} /> Dashboard
          </Link>
          <Link to="/iss" className="btn-ghost flex items-center gap-1.5">
            <Satellite size={14} /> ISS Tracker
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
