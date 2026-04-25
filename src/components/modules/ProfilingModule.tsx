"use client";

import React, { useState, useMemo } from "react";
import { useIGStore } from "@/lib/store";
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
import { Target, List, Megaphone, Search, Filter } from "lucide-react";

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
        <Card className="bg-primary/5 border-primary/20 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Kategori Profiling</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Label minat dari Meta</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-500/5 border-blue-500/20 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Topik Utama</CardTitle>
            <List className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{topics.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Topik konten yang relevan</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-500/5 border-purple-500/20 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-600">Pengiklan</CardTitle>
            <Megaphone className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{advertisers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Brand yang menargetkan kamu</p>
          </CardContent>
        </Card>
      </div>

      {advertisers.length > 0 && (
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
                      <TableCell className="text-right pr-6 text-xs text-muted-foreground italic">
                        {adv.sourceGroup}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredAdvertisers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                        Tidak ada pengiklan yang cocok dengan pencarian "{searchTerm}"
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {categories.length === 0 && topics.length === 0 && advertisers.length === 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center space-y-4">
             <div className="p-4 rounded-full bg-muted">
                <Megaphone className="w-8 h-8 text-muted-foreground" />
             </div>
             <div className="space-y-1">
                <p className="font-semibold">Belum ada data profiling</p>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Silakan upload file <b>your_topics.json</b> atau <b>advertisers_*.json</b> untuk melihat analisisnya.
                </p>
             </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
