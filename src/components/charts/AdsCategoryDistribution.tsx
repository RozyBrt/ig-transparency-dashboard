// src/components/charts/AdsCategoryDistribution.tsx

'use client';

import { useMemo, useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
  PieLabelRenderProps,
} from 'recharts';
import { useIGStore } from '@/lib/store';
import type { MetaCategory } from '@/types';

const COLORS = [
  '#22c55e', '#06b6d4', '#f59e0b', '#ef4444', 
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
];

interface DistributionItem {
  name: string;
  value: number;
  percentage: string;
}

export function AdsCategoryDistribution() {
  const { categories } = useIGStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const distributionData = useMemo(() => {
    if (categories.length === 0) return [];

    const grouped = categories.reduce(
      (acc, cat: MetaCategory) => {
        const existing = acc.find((item) => item.name === cat.autoGroup);
        if (existing) {
          existing.value += 1;
        } else {
          acc.push({
            name: cat.autoGroup,
            value: 1,
            percentage: "0",
          });
        }
        return acc;
      },
      [] as DistributionItem[]
    );

    const total = categories.length;
    grouped.forEach((g) => {
      g.percentage = ((g.value / total) * 100).toFixed(1);
    });

    return grouped.sort((a, b) => b.value - a.value);
  }, [categories]);

  if (categories.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center">
        <p className="text-zinc-500 text-sm">Upload data kategori iklan untuk melihat sebaran</p>
      </div>
    );
  }

  if (!isMounted) return <div className="h-[450px] w-full bg-zinc-900 rounded-lg animate-pulse" />;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-zinc-200 mb-1">
          📊 Ads Category Distribution
        </h3>
        <p className="text-sm text-zinc-400">
          Sebaran label profiling Meta ({categories.length} label total)
        </p>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={distributionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(props: PieLabelRenderProps) => {
                const entry = props as PieLabelRenderProps & { percentage: string };
                return `${entry.name} (${entry.percentage}%)`;
              }}
              outerRadius={100}
              dataKey="value"
            >
              {distributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                border: '1px solid #3f3f46',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              itemStyle={{ color: '#e4e4e7' }}
              labelStyle={{ color: '#a1a1aa' }}
              formatter={(...args: unknown[]) => {
                const value = args[0] as number;
                const name = args[1] as string;
                const entry = args[2] as { payload: DistributionItem };
                return [`${value} label (${entry.payload.percentage}%)`, name];
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px', fontSize: '11px' }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-zinc-800/50">
        <table className="w-full text-xs">
          <thead className="bg-zinc-800/50">
            <tr>
              <th className="text-left py-2.5 px-4 text-zinc-500 font-bold uppercase tracking-wider">Kategori</th>
              <th className="text-right py-2.5 px-4 text-zinc-500 font-bold uppercase tracking-wider">Count</th>
              <th className="text-right py-2.5 px-4 text-zinc-500 font-bold uppercase tracking-wider">%</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {distributionData.map((row, idx) => (
              <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                <td className="py-2.5 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    <span className="text-zinc-300 truncate">{row.name}</span>
                  </div>
                </td>
                <td className="text-right py-2.5 px-4 text-zinc-200 font-medium">{row.value}</td>
                <td className="text-right py-2.5 px-4 text-zinc-400">{row.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
