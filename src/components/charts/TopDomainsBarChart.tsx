// src/components/charts/TopDomainsBarChart.tsx

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
import type { LinkEntry } from '@/types';

const DOMAIN_COLORS = ['#22c55e', '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6'];

interface DomainDataItem {
  domain: string;
  count: number;
  totalDuration: number;
  avgDuration: number;
  displayName: string;
}

export function TopDomainsBarChart() {
  const { linkHistory } = useIGStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const topDomainsData = useMemo(() => {
    if (linkHistory.length === 0) return [];

    const domainCounts = linkHistory.reduce(
      (acc, link: LinkEntry) => {
        const domain = link.domain;
        const existing = acc.find((item) => item.domain === domain);

        if (existing) {
          existing.count += 1;
          if (link.duration && link.duration > 0) existing.totalDuration += link.duration;
        } else {
          acc.push({
            domain,
            count: 1,
            totalDuration: link.duration || 0,
            avgDuration: 0,
            displayName: '',
          });
        }
        return acc;
      },
      [] as DomainDataItem[]
    );

    domainCounts.forEach((d) => {
      d.avgDuration = Math.round(d.totalDuration / d.count);
      d.displayName = d.domain.length > 15 ? d.domain.substring(0, 12) + '...' : d.domain;
    });

    return domainCounts.sort((a, b) => b.count - a.count).slice(0, 10);
  }, [linkHistory]);

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return '—';
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h`;
  };

  if (linkHistory.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center">
        <p className="text-zinc-500 text-sm">Upload link_history.json untuk melihat domain populer</p>
      </div>
    );
  }

  if (!isMounted) return <div className="h-[450px] w-full bg-zinc-900 rounded-lg animate-pulse" />;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-zinc-200 mb-1">
          🔗 Top Domains Analysis
        </h3>
        <p className="text-sm text-zinc-400">
          Website yang paling sering dikunjungi via IG browser ({linkHistory.length} klik)
        </p>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topDomainsData} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis dataKey="displayName" stroke="#71717a" tick={{ fontSize: 9 }} angle={-45} textAnchor="end" height={60} />
            <YAxis stroke="#71717a" tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', fontSize: '11px' }}
              cursor={{ fill: '#ffffff05' }}
              labelFormatter={(...args: unknown[]) => {
                const payload = args[1] as Array<{ payload: DomainDataItem }>;
                return payload?.[0]?.payload?.domain || '';
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {topDomainsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={DOMAIN_COLORS[index % DOMAIN_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-zinc-800/50">
        <table className="w-full text-[11px]">
          <thead className="bg-zinc-800/50">
            <tr>
              <th className="text-left py-2 px-4 text-zinc-500 font-bold uppercase tracking-wider">Domain</th>
              <th className="text-center py-2 px-4 text-zinc-500 font-bold uppercase tracking-wider">Clicks</th>
              <th className="text-center py-2 px-4 text-zinc-500 font-bold uppercase tracking-wider">Avg Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {topDomainsData.map((row, idx) => (
              <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                <td className="py-2 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: DOMAIN_COLORS[idx % DOMAIN_COLORS.length] }}></div>
                    <a href={`https://${row.domain}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline truncate" title={row.domain}>{row.domain}</a>
                  </div>
                </td>
                <td className="text-center py-2 px-4 text-zinc-200 font-medium">{row.count}</td>
                <td className="text-center py-2 px-4 text-zinc-400">{formatDuration(row.avgDuration)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
