// src/components/charts/LoginActivityHeatmap.tsx

'use client';

import { useMemo, useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useIGStore } from '@/lib/store';
import type { LoginEntry } from '@/types';

interface HourlyDataItem {
  hour: number;
  hourLabel: string;
  count: number;
  percentage: number;
}

export function LoginActivityHeatmap() {
  const { loginActivity } = useIGStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Compute hourly distribution
  const hourlyData = useMemo(() => {
    if (loginActivity.length === 0) return [];

    const hours: HourlyDataItem[] = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      hourLabel: `${String(i).padStart(2, '0')}:00`,
      count: 0,
      percentage: 0,
    }));

    loginActivity.forEach((login: LoginEntry) => {
      const date = new Date(login.date);
      const hour = date.getHours();
      if (hours[hour]) {
        hours[hour].count += 1;
      }
    });

    const total = loginActivity.length;
    hours.forEach((h) => {
      h.percentage = total > 0 ? Number(((h.count / total) * 100).toFixed(1)) : 0;
    });

    return hours;
  }, [loginActivity]);

  const getColorByIntensity = (count: number, max: number) => {
    const ratio = count / max;
    if (ratio === 0) return '#27272a';
    if (ratio < 0.25) return '#06b6d4';
    if (ratio < 0.5) return '#22c55e';
    if (ratio < 0.75) return '#f59e0b';
    return '#ef4444';
  };

  const maxCount = Math.max(...hourlyData.map((h) => h.count), 1);

  if (loginActivity.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center">
        <p className="text-zinc-500 text-sm">Upload login_activity.json untuk melihat heatmap</p>
      </div>
    );
  }

  if (!isMounted) return <div className="h-[400px] w-full bg-zinc-900 rounded-lg animate-pulse" />;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-zinc-200 mb-1">
          🕐 Login Activity Heatmap
        </h3>
        <p className="text-sm text-zinc-400">
          Kapan kamu paling sering buka IG? (Berdasarkan {loginActivity.length} data login)
        </p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={hourlyData}
            margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis
              dataKey="hourLabel"
              stroke="#71717a"
              tick={{ fontSize: 10 }}
              interval={2}
            />
            <YAxis stroke="#71717a" tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                border: '1px solid #3f3f46',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              cursor={{ fill: '#ffffff05' }}
              formatter={(value: number | string) => [`${value} login`, 'Count']}
              labelFormatter={(label: string) => `Jam: ${label}`}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {hourlyData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getColorByIntensity(entry.count, maxCount)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {(() => {
          const peakHour = hourlyData.reduce((prev, current) =>
            current.count > prev.count ? current : prev
          );
          const activeHoursData = hourlyData.filter((h) => h.count > 0);
          const avgLogins = activeHoursData.length > 0 
            ? (loginActivity.length / activeHoursData.length).toFixed(1)
            : "0";

          return (
            <>
              <div className="bg-zinc-800/30 border border-zinc-800/50 rounded-xl p-4">
                <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-1">Peak Hour</p>
                <p className="text-xl font-bold text-orange-500">{peakHour.hourLabel}</p>
                <p className="text-xs text-zinc-400 mt-1">{peakHour.count} total login</p>
              </div>
              <div className="bg-zinc-800/30 border border-zinc-800/50 rounded-xl p-4">
                <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-1">Active Hours</p>
                <p className="text-xl font-bold text-cyan-500">{activeHoursData.length} jam</p>
                <p className="text-xs text-zinc-400 mt-1">Rentang waktu aktif harian</p>
              </div>
              <div className="bg-zinc-800/30 border border-zinc-800/50 rounded-xl p-4">
                <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-1">Avg/Hour</p>
                <p className="text-xl font-bold text-green-500">{avgLogins}</p>
                <p className="text-xs text-zinc-400 mt-1">Login per jam aktif</p>
              </div>
            </>
          );
        })()}
      </div>

      <div className="mt-6 pt-4 border-t border-zinc-800/50">
        <div className="flex flex-wrap items-center gap-4 text-[10px]">
          <span className="text-zinc-500 uppercase font-bold">Intensity:</span>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-zinc-800 rounded-full"></div>
            <span className="text-zinc-400">None</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
            <span className="text-zinc-400">Low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-zinc-400">Med</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span className="text-zinc-400">High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-zinc-400">Peak</span>
          </div>
        </div>
      </div>
    </div>
  );
}
