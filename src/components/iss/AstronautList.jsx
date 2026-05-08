import { motion } from 'framer-motion';
import { Users, User } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { SkeletonCard } from '@/components/ui/Skeleton';

// Country flag emoji from craft name heuristic
function getCraftBadge(craft) {
  if (craft?.toLowerCase().includes('iss')) return '🛸';
  if (craft?.toLowerCase().includes('tiangong') || craft?.toLowerCase().includes('css')) return '🚀';
  return '🛸';
}

export function AstronautList({ astronauts, loading }) {
  if (loading && !astronauts) {
    return <SkeletonCard lines={4} />;
  }

  if (!astronauts) return null;

  const issAstronauts = astronauts.people?.filter(
    (p) => p.craft === 'ISS' || p.craft === 'ISS/SpX'
  ) || [];

  const others = astronauts.people?.filter(
    (p) => p.craft !== 'ISS' && p.craft !== 'ISS/SpX'
  ) || [];

  return (
    <Card>
      <CardHeader
        title="People in Space"
        icon={Users}
        subtitle={`${astronauts.number} humans currently off Earth`}
        action={
          <span className="badge-cyan text-xs">
            {astronauts.number} total
          </span>
        }
      />

      <div className="space-y-3">
        {astronauts.people?.map((person, i) => (
          <motion.div
            key={person.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <User size={14} className="text-cyan-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {person.name}
              </p>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                {getCraftBadge(person.craft)} {person.craft}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
