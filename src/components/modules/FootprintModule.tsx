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
import { LogIn, Link2, Monitor, Globe, Clock, FileJson, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
        <Card className={cn(
          "transition-all duration-300",
          loginActivity.length === 0 ? "bg-muted/20 border-dashed" : "bg-orange-500/5 border-orange-500/20 shadow-sm"
        )}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktivitas Login</CardTitle>
            <LogIn className={cn("h-4 w-4", loginActivity.length > 0 ? "text-orange-500" : "text-muted-foreground")} />
          </CardHeader>
          <CardContent>
            {loginActivity.length > 0 ? (
              <>
                <div className="text-3xl font-bold">{loginActivity.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Catatan login perangkat & IP</p>
              </>
            ) : (
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <AlertCircle className="w-3 h-3 text-amber-500" />
                <span>Butuh <b>login_activity.json</b></span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={cn(
          "transition-all duration-300",
          linkHistory.length === 0 ? "bg-muted/20 border-dashed" : "bg-cyan-500/5 border-cyan-500/20 shadow-sm"
        )}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Riwayat Link</CardTitle>
            <Link2 className={cn("h-4 w-4", linkHistory.length > 0 ? "text-cyan-500" : "text-muted-foreground")} />
          </CardHeader>
          <CardContent>
            {linkHistory.length > 0 ? (
              <>
                <div className="text-3xl font-bold">{linkHistory.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Link yang pernah kamu klik di IG</p>
              </>
            ) : (
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <FileJson className="w-3 h-3" />
                <span>Butuh <b>link_history.json</b></span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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
              {loginActivity.length > 0 ? (
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
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                  <Clock className="w-8 h-8 text-muted-foreground opacity-20" />
                  <p className="text-xs text-muted-foreground">Belum ada data login.</p>
                </div>
              )}
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
                <p className="text-xs text-center text-muted-foreground py-4 italic">
                  Belum ada riwayat link.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
