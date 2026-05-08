import { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { PieChart as PieChartIcon } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';

const COLORS = ['#00f5ff', '#0066ff', '#7c3aed', '#ec4899', '#10b981', '#f59e0b', '#ef4444'];
const CHART_HEIGHT = 224;

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-2.5 text-xs border border-cyan-500/30">
      <p className="font-semibold text-white">{payload[0].name}</p>
      <p className="text-cyan-400">{payload[0].value} articles</p>
    </div>
  );
};

export function NewsChart({ articles }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const data = useMemo(() => {
    if (!articles?.length) return [];
    const counts = {};
    articles.forEach(a => {
      const name = a.source?.name || 'Unknown';
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([name, value]) => ({ name, value }));
  }, [articles]);

  if (!data.length) return null;

  return (
    <Card>
      <CardHeader title="Articles by Source" icon={PieChartIcon} subtitle={`${data.length} sources`} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ width: '100%', height: CHART_HEIGHT }}
      >
        {mounted && (
          <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8}
                formatter={v => <span className="text-xs text-gray-400">{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </motion.div>
    </Card>
  );
}
