'use client';

import { useIGStore } from '@/lib/store';
import { LoginActivityHeatmap, TopDomainsBarChart } from '@/components/charts';
import { Card, CardContent } from "@/components/ui/card";
import { LogIn, Link2 } from "lucide-react";

export function FootprintModule() {
  const { loginActivity, linkHistory } = useIGStore();

  const uniqueIPs = new Set(loginActivity.map((l) => l.ip)).size;
  const uniqueDomains = new Set(linkHistory.map((l) => l.domain)).size;
  const uniqueDevices = new Set(loginActivity.map((l) => l.device)).size;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 border border-zinc-800 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
                <LogIn className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-200">Login Activity</h3>
                <p className="text-sm text-zinc-500">Total login yang tercatat di akun</p>
              </div>
            </div>
            
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold text-orange-500">{loginActivity.length}</span>
              <span className="text-sm text-zinc-500">records</span>
            </div>

            {loginActivity.length > 0 && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-1">Unique IPs</p>
                  <p className="text-xl font-bold text-blue-400">{uniqueIPs}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-1">Device Types</p>
                  <p className="text-xl font-bold text-purple-400">{uniqueDevices}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border border-zinc-800 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-500">
                <Link2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-200">Link History</h3>
                <p className="text-sm text-zinc-500">Link yang dikunjungi via IG browser</p>
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold text-cyan-500">{linkHistory.length}</span>
              <span className="text-sm text-zinc-500">clicks</span>
            </div>

            {linkHistory.length > 0 && (
              <div className="pt-4 border-t border-zinc-800">
                <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-1">Unique Domains</p>
                <p className="text-xl font-bold text-amber-400">{uniqueDomains}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6">
        <LoginActivityHeatmap />
        <TopDomainsBarChart />
      </div>
    </div>
  );
}
