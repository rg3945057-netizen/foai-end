import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Satellite, Newspaper, Bot, ArrowRight, Zap, Globe2, Users } from 'lucide-react';
import { useISSData } from '@/hooks/useISSData';
import { useNews } from '@/hooks/useNews';
import { useChatbot } from '@/hooks/useChatbot';
import { Card, CardHeader } from '@/components/ui/Card';
import { ISSMap } from '@/components/iss/ISSMap';
import { SpeedChart } from '@/components/iss/SpeedChart';
import { AstronautList } from '@/components/iss/AstronautList';
import { NewsCard } from '@/components/news/NewsCard';
import { NewsChart } from '@/components/news/NewsChart';
import { ErrorState } from '@/components/ui/ErrorState';
import { SkeletonCard, SkeletonMap } from '@/components/ui/Skeleton';
import { formatCoord } from '@/utils/dateFormat';
import toast from 'react-hot-toast';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function HeroStat({ label, value, icon: Icon, color = 'cyan' }) {
  return (
    <motion.div variants={item}>
      <Card className="text-center" hover>
        <div className={`mx-auto mb-2 p-2.5 w-fit rounded-xl bg-${color}-500/10 border border-${color}-500/20`}>
          <Icon size={20} className={`text-${color}-400`} />
        </div>
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <p className={`text-lg font-bold font-mono text-${color}-400`}>{value}</p>
      </Card>
    </motion.div>
  );
}

export default function HomePage() {
  const { position, positions, speeds, astronauts, region, loading: issLoading, error: issError, refresh: refreshISS } = useISSData();
  const { articles, loading: newsLoading, error: newsError, fetchNews } = useNews();
  const { openChat } = useChatbot();

  useEffect(() => {
    document.title = 'ISS Orbit Intelligence Dashboard';
    fetchNews();
  }, []);

  useEffect(() => {
    if (position && !issLoading) {
      toast.success('ISS position updated', { id: 'iss-update', duration: 2000 });
    }
  }, [position?.timestamp]);

  const latestSpeed = speeds?.[speeds.length - 1]?.speed;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden glass-card p-6 md:p-8"
      >
        {/* Decorative orb */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-radial from-cyan-500/20 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-gradient-radial from-blue-500/15 to-transparent blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="live-dot" />
              <span className="text-xs font-medium text-green-400">Live Tracking Active</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              ISS Orbit{' '}
              <span className="text-gradient-cyan">Intelligence</span>{' '}
              Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg">
              Real-time International Space Station tracking, space news, and an AI assistant — all in one futuristic dashboard.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link to="/iss" className="btn-primary text-sm flex items-center gap-1.5">
              <Satellite size={14} /> Track ISS
            </Link>
            <button onClick={openChat} className="btn-ghost text-sm flex items-center gap-1.5">
              <Bot size={14} /> Ask AI
            </button>
          </div>
        </div>
      </motion.div>

      {/* Hero Stats */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        <HeroStat
          label="Latitude"
          value={position ? `${formatCoord(position.latitude)}°` : '--'}
          icon={Globe2}
          color="cyan"
        />
        <HeroStat
          label="Longitude"
          value={position ? `${formatCoord(position.longitude)}°` : '--'}
          icon={Globe2}
          color="blue"
        />
        <HeroStat
          label="Speed"
          value={latestSpeed ? `${latestSpeed.toLocaleString()} km/h` : position?.velocity ? `${Math.round(position.velocity).toLocaleString()} km/h` : '--'}
          icon={Zap}
          color="green"
        />
        <HeroStat
          label="In Space"
          value={astronauts ? `${astronauts.number} people` : '--'}
          icon={Users}
          color="purple"
        />
      </motion.div>

      {/* Map + Astronauts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="p-0 overflow-hidden" hover={false}>
            <div className="p-4 border-b border-white/10">
              <CardHeader
                title="ISS Live Map"
                icon={Satellite}
                subtitle={region ? `Currently over: ${region}` : 'Acquiring position...'}
              />
            </div>
            {issError ? (
              <div className="p-4">
                <ErrorState message={issError} onRetry={refreshISS} />
              </div>
            ) : (
              <div style={{ height: '320px' }}>
                <ISSMap position={position} positions={positions} />
              </div>
            )}
          </Card>
        </motion.div>

        {/* Astronauts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <AstronautList astronauts={astronauts} loading={issLoading} />
        </motion.div>
      </div>

      {/* Speed Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <SpeedChart speeds={speeds} />
      </motion.div>

      {/* News + Chart row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Latest News */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 space-y-3"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Newspaper size={16} className="text-cyan-400" /> Latest News
            </h2>
            <Link
              to="/news"
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {newsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[1, 2].map((i) => <SkeletonCard key={i} lines={3} />)}
            </div>
          ) : newsError ? (
            <ErrorState message={newsError} onRetry={fetchNews} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {articles.slice(0, 4).map((article, i) => (
                <NewsCard key={article.url} article={article} index={i} />
              ))}
            </div>
          )}
        </motion.div>

        {/* News Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <NewsChart articles={articles} />
        </motion.div>
      </div>
    </div>
  );
}
