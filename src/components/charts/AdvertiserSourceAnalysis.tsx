// src/components/charts/AdvertiserSourceAnalysis.tsx

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
import type { Advertiser } from '@/types';

const SEVERITY_COLORS = {
  high: '#ef4444',    // red-500
  medium: '#f59e0b',  // amber-500
  low: '#22c55e',     // green-500
};

interface SourceItem {
  source: string;
  count: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
  icon: string;
  advertisers: string[];
}

export function AdvertiserSourceAnalysis() {
  const { advertisers } = useIGStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Analyze data sources
  const sourceAnalysis = useMemo(() => {
    if (advertisers.length === 0) return [];

    const sources = advertisers.reduce(
      (acc, adv: Advertiser) => {
        const sourceName = adv.dataSource?.name || 'Unknown Source';
        const existing = acc.find((item) => item.source === sourceName);

        if (existing) {
          existing.count += 1;
          existing.advertisers.push(adv.name);
        } else {
          acc.push({
            source: sourceName,
            count: 1,
            severity: adv.dataSeverity || 'low',
            description:
              adv.dataSource?.description || 'Data source tidak teridentifikasi',
            icon: adv.dataSource?.icon || '❓',
            advertisers: [adv.name],
          });
        }
        return acc;
      },
      [] as SourceItem[]
    );

    return sources.sort((a, b) => {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }, [advertisers]);

  // Severity distribution
  const severityCount = useMemo(() => {
    return {
      high: advertisers.filter(
        (a: Advertiser) => a.dataSeverity === 'high'
      ).length,
      medium: advertisers.filter(
        (a: Advertiser) => a.dataSeverity === 'medium'
      ).length,
      low: advertisers.filter(
        (a: Advertiser) => a.dataSeverity === 'low'
      ).length,
    };
  }, [advertisers]);

  if (advertisers.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center">
        <p className="text-zinc-500 text-sm">
          Upload advertisers_using_your_activity_or_information.json untuk analisis sumber data
        </p>
      </div>
    );
  }

  if (!isMounted) return <div className="h-[500px] w-full bg-zinc-900 rounded-lg animate-pulse" />;

  return (
    <div className="space-y-6">
      {/* Severity Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AlertCard
          severity="high"
          count={severityCount.high}
          label="High Risk"
          description="Akses ke data sensitif (Email/Offline)"
        />
        <AlertCard
          severity="medium"
          count={severityCount.medium}
          label="Medium Risk"
          description="Tracking aktivitas web/app"
        />
        <AlertCard
          severity="low"
          count={severityCount.low}
          label="Low Risk"
          description="Berdasarkan interaksi sosial"
        />
      </div>

      {/* Data Source Distribution Chart */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-zinc-200 mb-1">
            📊 Data Source Distribution
          </h3>
          <p className="text-sm text-zinc-400">
            Bagaimana pengiklan mendapatkan informasi tentang kamu?
          </p>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sourceAnalysis}
              margin={{ top: 20, right: 10, left: -20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="source"
                stroke="#71717a"
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={60}
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
                formatter={(...args: unknown[]) => [`${args[0]} advertiser`, 'Count']}
                labelFormatter={(...args: unknown[]) => `Source: ${args[0]}`}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {sourceAnalysis.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={SEVERITY_COLORS[entry.severity]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Source Details Table */}
        <div className="mt-8 overflow-hidden rounded-xl border border-zinc-800/50">
          <table className="w-full text-[11px]">
            <thead className="bg-zinc-800/50">
              <tr>
                <th className="text-left py-2.5 px-4 text-zinc-500 font-bold uppercase tracking-wider">Data Source</th>
                <th className="text-center py-2.5 px-4 text-zinc-500 font-bold uppercase tracking-wider">Count</th>
                <th className="text-center py-2.5 px-4 text-zinc-500 font-bold uppercase tracking-wider">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {sourceAnalysis.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-start gap-2">
                      <span className="text-base">{row.icon}</span>
                      <div>
                        <p className="font-bold text-zinc-200">{row.source}</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5 leading-tight">
                          {row.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="text-center py-3 px-4 text-zinc-200 font-bold">
                    {row.count}
                  </td>
                  <td className="text-center py-3 px-4">
                    <span
                      className={`px-1.5 py-0.5 rounded-[4px] text-[9px] font-black tracking-tighter ${
                        row.severity === 'high'
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                          : row.severity === 'medium'
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            : 'bg-green-500/10 text-green-500 border border-green-500/20'
                      }`}
                    >
                      {row.severity.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Example Advertisers per Source */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sourceAnalysis.slice(0, 4).map((source, idx) => (
          <div
            key={idx}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{source.icon}</span>
              <div>
                <p className="font-bold text-zinc-200 text-xs">{source.source}</p>
                <p className="text-[10px] text-zinc-500">{source.count} brand</p>
              </div>
            </div>

            <div className="space-y-1.5">
              {source.advertisers.slice(0, 3).map((name, i) => (
                <p key={i} className="text-[10px] text-zinc-400 flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
                  {name}
                </p>
              ))}
              {source.advertisers.length > 3 && (
                <p className="text-[9px] text-zinc-600 pl-2.5">
                  +{source.advertisers.length - 3} brand lainnya...
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Privacy Insight */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <p className="text-xs font-bold text-red-500 uppercase tracking-widest">Privacy Insight</p>
        </div>
        <p className="text-[11px] text-zinc-400 leading-relaxed">
          Ada <span className="text-red-400 font-bold">{severityCount.high} pengiklan</span> yang memiliki akses data sensitif kamu 
          (melalui email yang di-upload atau aktivitas belanja offline). 
          Ini mencakup <span className="text-zinc-200 font-bold">{((severityCount.high / advertisers.length) * 100).toFixed(1)}%</span> dari total list pengiklan kamu.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ALERT CARD COMPONENT
// ─────────────────────────────────────────────────────────────

interface AlertCardProps {
  severity: 'high' | 'medium' | 'low';
  count: number;
  label: string;
  description: string;
}

function AlertCard({ severity, count, label, description }: AlertCardProps) {
  const colorMap = {
    high: { bg: 'bg-red-500/5', border: 'border-red-500/20', text: 'text-red-500', sub: 'text-red-500/50' },
    medium: { bg: 'bg-amber-500/5', border: 'border-amber-500/20', text: 'text-amber-500', sub: 'text-amber-500/50' },
    low: { bg: 'bg-green-500/5', border: 'border-green-500/20', text: 'text-green-500', sub: 'text-green-500/50' },
  };

  const colors = colorMap[severity];

  return (
    <div className={`border rounded-xl p-4 ${colors.bg} ${colors.border} transition-all hover:shadow-lg`}>
      <p className={`text-3xl font-black ${colors.text}`}>{count}</p>
      <p className="text-xs font-bold text-zinc-200 mt-1 uppercase tracking-tight">{label}</p>
      <p className={`text-[10px] ${colors.sub} mt-0.5 leading-tight`}>{description}</p>
    </div>
  );
}
