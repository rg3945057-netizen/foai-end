import { motion } from 'framer-motion';
import { Globe2, Zap, Navigation, Clock, MapPin, RefreshCw } from 'lucide-react';

function StatCard({ icon: Icon, label, value, color = 'cyan', loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card flex items-center gap-3 p-4"
    >
      <div className={`p-2.5 rounded-xl bg-${color}-500/10 border border-${color}-500/20 flex-shrink-0`}>
        <Icon size={18} className={`text-${color}-400`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 truncate">{label}</p>
        {loading ? (
          <div className="h-5 w-24 bg-white/10 rounded animate-pulse mt-1" />
        ) : (
          <p className={`font-mono font-bold text-sm text-${color}-300 truncate`}>{value ?? '—'}</p>
        )}
      </div>
    </motion.div>
  );
}

export function ISSStats({ position, positions, currentSpeed, region, lastUpdated, loading, error, refresh }) {
  const fmt = (v, d = 4) => (v != null ? parseFloat(v).toFixed(d) : '—');

  const updatedStr = lastUpdated
    ? lastUpdated.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '—';

  return (
    <div className="space-y-3">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <span className="text-xs font-semibold text-green-400">Live Tracking</span>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all disabled:opacity-40"
          aria-label="Refresh ISS Data"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Fetching…' : 'Refresh'}
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="glass-card p-3 border border-red-500/30 bg-red-500/10 text-red-400 text-sm flex items-center justify-between gap-3">
          <span>{error}</span>
          <button onClick={refresh} className="text-xs underline hover:no-underline flex-shrink-0">Retry</button>
        </div>
      )}

      {/* Stat cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard icon={Globe2}     label="Latitude"       value={`${fmt(position?.latitude)}°`}   color="cyan"   loading={loading} />
        <StatCard icon={Globe2}     label="Longitude"      value={`${fmt(position?.longitude)}°`}  color="blue"   loading={loading} />
        <StatCard icon={Zap}        label="Speed"          value={currentSpeed ? `${currentSpeed.toLocaleString()} km/h` : '—'} color="green"  loading={loading} />
        <StatCard icon={Navigation} label="Altitude"       value="~408 km"                          color="purple" loading={false}   />
        <StatCard icon={MapPin}     label="Region"         value={region}                           color="orange" loading={loading} />
        <StatCard icon={Clock}      label="Last Updated"   value={updatedStr}                       color="pink"   loading={loading} />
      </div>

      <p className="text-xs text-gray-500 text-right">
        {positions.length} position{positions.length !== 1 ? 's' : ''} tracked · Updates every 15s
      </p>
    </div>
  );
}
