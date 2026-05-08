import { motion, AnimatePresence } from 'framer-motion';
import { Users, Rocket } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';

const CRAFT_COLORS = {
  ISS:     'cyan',
  Tiangong:'purple',
};

function AstronautRow({ person, index }) {
  const color = CRAFT_COLORS[person.craft] || 'blue';
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0"
    >
      <div className={`w-7 h-7 rounded-full bg-${color}-500/20 border border-${color}-500/40 flex items-center justify-center flex-shrink-0`}>
        <span className="text-xs font-bold text-gray-300">{index + 1}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-200 truncate">{person.name}</p>
        <p className={`text-xs text-${color}-400`}>{person.craft}</p>
      </div>
      <Rocket size={13} className={`text-${color}-500 flex-shrink-0`} />
    </motion.div>
  );
}

export function AstronautsPanel({ astronauts, loading }) {
  if (loading && !astronauts) {
    return (
      <Card>
        <CardHeader title="People in Space" icon={Users} subtitle="Loading…" />
        <div className="space-y-3 mt-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-7 h-7 rounded-full bg-white/10" />
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-white/10 rounded w-3/4" />
                <div className="h-2 bg-white/10 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!astronauts) return null;

  return (
    <Card>
      <CardHeader
        title="People in Space"
        icon={Users}
        subtitle={`${astronauts.number} people currently in orbit`}
      />

      {/* Count badge */}
      <div className="mt-3 mb-4 flex items-center gap-2">
        <span className="text-4xl font-bold font-mono text-cyan-400">
          {astronauts.number}
        </span>
        <span className="text-sm text-gray-400 leading-tight">
          humans<br />in space
        </span>
      </div>

      {/* Astronaut list */}
      <div className="space-y-0 max-h-64 overflow-y-auto pr-1">
        <AnimatePresence>
          {astronauts.people.map((person, i) => (
            <AstronautRow key={person.name} person={person} index={i} />
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
}
