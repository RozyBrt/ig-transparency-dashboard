"use client";

import React, { useState, useMemo } from "react";
import { useIGStore } from "@/lib/store";
import { AdsCategoryDistribution, AdvertiserSourceAnalysis } from '@/components/charts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Target, List, Megaphone, Search, AlertCircle, FileJson } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProfilingModule() {
  const { categories, topics, advertisers } = useIGStore();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter advertisers based on search term
  const filteredAdvertisers = useMemo(() => {
    if (!searchTerm) return advertisers;
    const s = searchTerm.toLowerCase();
    return advertisers.filter(
      (a) => a.name.toLowerCase().includes(s) || a.type.toLowerCase().includes(s)
    );
  }, [advertisers, searchTerm]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Card Kategori */}
        <Card className={cn(
          "transition-all duration-300",
          categories.length === 0 ? "bg-muted/20 border-dashed" : "bg-primary/5 border-primary/20 shadow-sm"
        )}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kategori Profiling</CardTitle>
            <Target className={cn("h-4 w-4", categories.length > 0 ? "text-primary" : "text-muted-foreground")} />
          </CardHeader>
          <CardContent>
            {categories.length > 0 ? (
              <>
                <div className="text-3xl font-bold">{categories.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Label minat dari Meta</p>
              </>
            ) : (
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <FileJson className="w-3 h-3" />
                <span>Butuh <b>ads_interests.json</b></span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card Topik */}
        <Card className={cn(
          "transition-all duration-300",
          topics.length === 0 ? "bg-muted/20 border-dashed" : "bg-blue-500/5 border-blue-500/20 shadow-sm"
        )}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Topik Utama</CardTitle>
            <List className={cn("h-4 w-4", topics.length > 0 ? "text-blue-500" : "text-muted-foreground")} />
          </CardHeader>
          <CardContent>
            {topics.length > 0 ? (
              <>
                <div className="text-3xl font-bold">{topics.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Topik konten yang relevan</p>
              </>
            ) : (
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <AlertCircle className="w-3 h-3 text-amber-500" />
                <span>Upload <b>your_topics.json</b></span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card Pengiklan */}
        <Card className={cn(
          "transition-all duration-300",
          advertisers.length === 0 ? "bg-muted/20 border-dashed" : "bg-purple-500/5 border-purple-500/20 shadow-sm"
        )}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengiklan</CardTitle>
            <Megaphone className={cn("h-4 w-4", advertisers.length > 0 ? "text-purple-500" : "text-muted-foreground")} />
          </CardHeader>
          <CardContent>
            {advertisers.length > 0 ? (
              <>
                <div className="text-3xl font-bold">{advertisers.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Brand yang menargetkan kamu</p>
              </>
            ) : (
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <FileJson className="w-3 h-3" />
                <span>Butuh file <b>advertisers_*.json</b></span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdsCategoryDistribution />
        <AdvertiserSourceAnalysis />
      </div>

      {/* Daftar Pengiklan Section */}
      {advertisers.length > 0 ? (
        <Card className="border-none shadow-lg bg-background/50 backdrop-blur-sm ring-1 ring-muted">
          <CardHeader className="border-b px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold">Daftar Pengiklan</CardTitle>
                <p className="text-sm text-muted-foreground">Mencakup {advertisers.length} brand yang menyimpan profil kamu</p>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Cari nama brand atau tipe bisnis..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[600px] overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 shadow-sm">
                  <TableRow>
                    <TableHead className="w-[300px] pl-6 text-xs uppercase font-bold tracking-wider">Nama Brand</TableHead>
                    <TableHead className="text-xs uppercase font-bold tracking-wider text-center">Tipe Bisnis</TableHead>
                    <TableHead className="text-xs uppercase font-bold tracking-wider text-right pr-6">Sumber Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdvertisers.map((adv, idx) => (
                    <TableRow key={idx} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-semibold py-4 pl-6 text-sm">
                        {adv.name}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={adv.type === "Lainnya" ? "outline" : "secondary"}
                          className="font-medium text-[10px]"
                        >
                          {adv.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex flex-col items-end">
                           <span className="text-xs text-muted-foreground italic">{adv.sourceGroup}</span>
                           {adv.dataSource && (
                             <Badge variant="outline" className={cn(
                               "mt-1 text-[9px] px-1 h-4",
                               adv.dataSeverity === 'high' ? "border-red-500/50 text-red-500" :
                               adv.dataSeverity === 'medium' ? "border-amber-500/50 text-amber-500" :
                               "border-green-500/50 text-green-500"
                             )}>
                               {adv.dataSource.icon} {adv.dataSource.name}
                             </Badge>
                           )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredAdvertisers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                        Tidak ada pengiklan yang cocok dengan pencarian &quot;{searchTerm}&quot;
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed border-2 py-12">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
             <Megaphone className="w-10 h-10 text-muted-foreground opacity-20" />
             <p className="text-sm text-muted-foreground max-w-sm">
               Daftar pengiklan akan muncul di sini setelah kamu meng-upload file <b>advertisers_*.json</b> dari folder ads_information.
             </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
