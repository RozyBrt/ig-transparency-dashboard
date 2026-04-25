"use client";

import React from "react";
import { useIGStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { LogIn, Link2, Monitor, Globe, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function FootprintModule() {
  const { loginActivity, linkHistory } = useIGStore();

  // Calculate Top 5 Domains
  const topDomains = React.useMemo(() => {
    const counts: Record<string, number> = {};
    linkHistory.forEach((link) => {
      if (link.domain) {
        counts[link.domain] = (counts[link.domain] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [linkHistory]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-orange-500/5 border-orange-500/20 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">Aktivitas Login</CardTitle>
            <LogIn className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loginActivity.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Catatan login perangkat & IP</p>
          </CardContent>
        </Card>

        <Card className="bg-cyan-500/5 border-cyan-500/20 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-cyan-600">Riwayat Link</CardTitle>
            <Link2 className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{linkHistory.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Link yang pernah kamu klik di IG</p>
          </CardContent>
        </Card>
      </div>

      {loginActivity.length > 0 && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Login Activity Table */}
          <Card className="md:col-span-2">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Monitor className="w-4 h-4" /> Daftar Login Terakhir
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[400px] overflow-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                    <TableRow>
                      <TableHead className="w-[180px]">Waktu</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Browser</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loginActivity.map((login, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="text-xs font-medium">
                          {new Date(login.date).toLocaleString('id-ID', { 
                            dateStyle: 'medium', 
                            timeStyle: 'short' 
                          })}
                        </TableCell>
                        <TableCell className="text-xs font-mono">{login.ip}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] bg-muted/30">
                            {login.device}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{login.browser}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Top Domains Card */}
          <Card className="h-fit">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Globe className="w-4 h-4" /> Top 5 Domains
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {topDomains.map(([domain, count], idx) => (
                  <div key={domain} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                        {idx + 1}
                      </div>
                      <span className="text-sm font-medium truncate max-w-[150px]">{domain}</span>
                    </div>
                    <Badge variant="secondary" className="font-mono">{count}</Badge>
                  </div>
                ))}
                {topDomains.length === 0 && (
                  <p className="text-sm text-center text-muted-foreground py-4 italic">
                    Belum ada riwayat link.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {loginActivity.length === 0 && linkHistory.length === 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="p-4 rounded-full bg-muted">
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold">Belum ada data footprint</p>
              <p className="text-sm text-muted-foreground max-w-sm">
                Silakan upload file JSON <b>login_history.json</b> dan <b>link_history.json</b> di Upload Center.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
