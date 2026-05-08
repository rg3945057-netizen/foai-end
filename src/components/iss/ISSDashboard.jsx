import { motion } from 'framer-motion';
import { Satellite } from 'lucide-react';
import { useISSData } from '@/hooks/useISSData';
import { ISSMap } from './ISSMap';
import { ISSStats } from './ISSStats';
import { AstronautsPanel } from './AstronautsPanel';
import { SpeedChart } from './SpeedChart';
import { Card, CardHeader } from '@/components/ui/Card';

export function ISSDashboard() {
  const {
    position,
    positions,
    speeds,
    astronauts,
    region,
    loading,
    error,
    lastUpdated,
    currentSpeed,
    refresh,
  } = useISSData();

  return (
    <div className="space-y-5">
      {/* Page title */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Satellite size={22} className="text-cyan-400" />
          ISS Live Tracker
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Polling <span className="text-cyan-400 font-mono">open-notify.org</span> every 15 seconds
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <ISSStats
          position={position}
          positions={positions}
          currentSpeed={currentSpeed}
          region={region}
          lastUpdated={lastUpdated}
          loading={loading}
          error={error}
          refresh={refresh}
        />
      </motion.div>

      {/* Map — full width */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="p-0 overflow-hidden" hover={false}>
          <div className="p-4 border-b border-white/10">
            <CardHeader
              title="Live Trajectory Map"
              icon={Satellite}
              subtitle={
                position
                  ? `${positions.length} tracked positions · ${region}`
                  : 'Acquiring ISS position…'
              }
            />
          </div>
          <div style={{ height: 420 }}>
            <ISSMap position={position} positions={positions} />
          </div>
        </Card>
      </motion.div>

      {/* Speed Chart + Astronauts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <SpeedChart speeds={speeds} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AstronautsPanel astronauts={astronauts} loading={loading} />
        </motion.div>
      </div>
    </div>
  );
}
