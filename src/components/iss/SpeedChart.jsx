import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs border border-cyan-500/30">
      <p className="text-gray-400 mb-0.5">{label}</p>
      <p className="font-mono font-bold text-cyan-300">
        {payload[0].value?.toLocaleString()} km/h
      </p>
    </div>
  );
};

const CHART_HEIGHT = 224; // explicit pixel height — fixes Recharts width/height(-1) warning

export function SpeedChart({ speeds }) {
  // Defer mount of ResponsiveContainer until the DOM element has real dimensions
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const avg = speeds.length
    ? Math.round(speeds.reduce((s, d) => s + (isNaN(d.speed) ? 0 : d.speed), 0) / speeds.length)
    : 0;

  if (!speeds.length) {
    return (
      <Card>
        <CardHeader title="ISS Speed History" icon={Activity} subtitle="Collecting measurements…" />
        <div className="flex items-center justify-center text-sm text-gray-500"
          style={{ height: CHART_HEIGHT }}>
          Waiting for data — updates every 15 seconds
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="ISS Speed History"
        icon={Activity}
        subtitle={`Last ${speeds.length} of 30 measurements · Avg ${avg.toLocaleString()} km/h`}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ width: '100%', height: CHART_HEIGHT }}
      >
        {mounted && (
          <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
            <AreaChart data={speeds} margin={{ top: 8, right: 6, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#00f5ff" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#00f5ff" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="time"
                tick={{ fill: '#6b7280', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={avg}
                stroke="rgba(0,245,255,0.4)"
                strokeDasharray="5 3"
                label={{ value: 'avg', fill: '#6b7280', fontSize: 10, position: 'insideTopRight' }}
              />
              <Area
                type="monotone"
                dataKey="speed"
                stroke="#00f5ff"
                strokeWidth={2}
                fill="url(#speedGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#00f5ff', stroke: '#0a0f2e', strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </motion.div>
    </Card>
  );
}
