'use client';

import { useMemo, useState } from 'react';
import { useIGStore } from '@/lib/store';
import {
  analyzeSocialRelationship,
  getSocialStats,
} from '@/lib/parsers/social';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users, UserMinus, UserCheck, AlertTriangle, Search, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

type SocialTab = 'overview' | 'mutuals' | 'notfollowback' | 'suspicious';

export function SocialModule() {
  const { followers, following } = useIGStore();
  const [activeTab, setActiveTab] = useState<SocialTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Analyze relationships
  const analysis = useMemo(() => {
    if (followers.length === 0 || following.length === 0) return null;
    return analyzeSocialRelationship(followers, following);
  }, [followers, following]);

  const stats = useMemo(() => {
    if (!analysis) return null;
    return getSocialStats(analysis);
  }, [analysis]);

  if (!analysis || !stats) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="p-4 rounded-full bg-muted">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-xl">Belum ada data Social Analysis</p>
            <p className="text-sm text-muted-foreground max-w-md">
              Tarik & lepas file <b>followers_1.json</b> dan <b>following.json</b> (dari folder <i>followers_and_following</i>) untuk melihat analisis pertemanan dan akun bot.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* ─────────────────────────────────────────────────────
          STATS CARDS
          ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<Users className="w-5 h-5 text-green-500" />}
          label="Followers"
          value={stats.totalFollowers}
          color="green"
        />
        <StatCard
          icon={<UserCheck className="w-5 h-5 text-cyan-500" />}
          label="Following"
          value={stats.totalFollowing}
          color="cyan"
        />
        <StatCard
          icon={<Users className="w-5 h-5 text-amber-500" />}
          label="Mutuals"
          value={stats.mutualCount}
          color="amber"
          sub={`${stats.followbackRatio}% follow back`}
        />
      </div>

      {/* ─────────────────────────────────────────────────────
          ALERT BOXES (Suspicious & Not Follow Back)
          ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AlertBox
          icon={<UserMinus className="w-6 h-6 text-red-500" />}
          title="Tidak Follow Back"
          count={stats.notFollowBackCount}
          description="Kamu follow tapi mereka nggak follow balik"
          color="red"
        />
        <AlertBox
          icon={<AlertTriangle className="w-6 h-6 text-yellow-500" />}
          title="Akun Mencurigakan"
          count={stats.suspiciousCount}
          description="Following dengan username bot-like atau spam pattern"
          color="yellow"
        />
      </div>

      {/* ─────────────────────────────────────────────────────
          TABS NAVIGATION
          ───────────────────────────────────────────────────── */}
      <div className="flex gap-2 border-b overflow-x-auto pb-4 scrollbar-hide">
        {[
          { id: 'overview' as SocialTab, label: '📊 Overview' },
          { id: 'mutuals' as SocialTab, label: '🤝 Mutuals' },
          { id: 'notfollowback' as SocialTab, label: '❌ Tidak Follow Back' },
          { id: 'suspicious' as SocialTab, label: '🤖 Mencurigakan' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchQuery('');
            }}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────
          TAB CONTENT
          ───────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <OverviewTab stats={stats} />
      )}

      {(activeTab === 'mutuals' || activeTab === 'notfollowback' || activeTab === 'suspicious') && (
        <ListTab
          title={
            activeTab === 'mutuals' ? "Daftar Mutuals" :
            activeTab === 'notfollowback' ? "Tidak Follow Back" : "Akun Mencurigakan"
          }
          items={
            activeTab === 'mutuals' ? analysis.mutuals :
            activeTab === 'notfollowback' ? analysis.notFollowBack :
            analysis.suspiciousFollowing.map(f => f.username)
          }
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          color={
            activeTab === 'mutuals' ? "green" :
            activeTab === 'notfollowback' ? "red" : "yellow"
          }
          description={
            activeTab === 'notfollowback' ? "Follow tapi mereka nggak follow balik — pertimbangkan untuk unfollow" :
            activeTab === 'suspicious' ? "Username dengan pattern bot atau spam — mungkin ingin di-block" : undefined
          }
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'green' | 'cyan' | 'amber';
  sub?: string;
}

function StatCard({ icon, label, value, color, sub }: StatCardProps) {
  const colorMap = {
    green: 'text-green-500',
    cyan: 'text-cyan-500',
    amber: 'text-amber-500',
  };

  const bgMap = {
    green: 'bg-green-500/5 border-green-500/20',
    cyan: 'bg-cyan-500/5 border-cyan-500/20',
    amber: 'bg-amber-500/5 border-amber-500/20',
  };

  return (
    <Card className={bgMap[color]}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={cn("text-3xl font-bold", colorMap[color])}>
          {value.toLocaleString()}
        </div>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}

interface AlertBoxProps {
  icon: React.ReactNode;
  title: string;
  count: number;
  description: string;
  color: 'red' | 'yellow';
}

function AlertBox({ icon, title, count, description, color }: AlertBoxProps) {
  const borderStyles = color === 'red' ? 'border-red-500/20 bg-red-500/5' : 'border-yellow-500/20 bg-yellow-500/5';
  const textStyles = color === 'red' ? 'text-red-600' : 'text-yellow-600';

  return (
    <Card className={cn("border", borderStyles)}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-background shadow-sm">
            {icon}
          </div>
          <div className="space-y-1">
            <p className={cn("font-bold", textStyles)}>{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
            <p className={cn("text-2xl font-bold mt-2", textStyles)}>
              {count.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface OverviewTabProps {
  stats: ReturnType<typeof getSocialStats>;
}

function OverviewTab({ stats }: OverviewTabProps) {
  return (
    <Card className="bg-background/50 backdrop-blur-sm shadow-lg border-muted/50">
      <CardHeader className="border-b">
        <CardTitle className="text-lg font-bold">📊 Ringkasan Analisis Sosial</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4 max-w-md">
          <div className="flex justify-between items-center py-1">
            <span className="text-muted-foreground">Total Following:</span>
            <span className="font-bold">{stats.totalFollowing}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-muted-foreground">Follow back (Mutual):</span>
            <span className="text-green-600 font-bold">
              {stats.mutualCount} ({stats.followbackRatio}%)
            </span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-muted-foreground">Tidak follow back:</span>
            <span className="text-red-600 font-bold">
              {stats.notFollowBackCount}
            </span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-muted-foreground">Fans (Follow mu tapi kamu belum):</span>
            <span className="text-cyan-600 font-bold">
              {stats.notFollowingBackCount}
            </span>
          </div>
          <div className="flex justify-between items-center py-1 border-t pt-4 mt-2">
            <span className="text-muted-foreground">Potensi Akun Spam/Bot:</span>
            <span className="text-yellow-600 font-bold">
              {stats.suspiciousCount}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ListTabProps {
  title: string;
  items: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  color: 'green' | 'red' | 'yellow';
  description?: string;
}

function ListTab({
  title,
  items,
  searchQuery,
  onSearchChange,
  color,
  description,
}: ListTabProps) {
  const filtered = items.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const bgStyles = {
    green: 'hover:bg-green-500/5',
    red: 'hover:bg-red-500/5',
    yellow: 'hover:bg-yellow-500/5',
  };

  return (
    <Card className="bg-background/50 backdrop-blur-sm shadow-lg overflow-hidden border-muted/50">
      <CardHeader className="border-b px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold">{title}</CardTitle>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Cari username..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="max-h-[500px] overflow-y-auto">
          {filtered.length > 0 ? (
            <div className="divide-y">
              {filtered.map((username, i) => (
                <div
                  key={i}
                  className={cn("px-6 py-4 flex items-center justify-between group transition-colors", bgStyles[color])}
                >
                  <span className="font-semibold text-sm">@{username}</span>
                  <a
                    href={`https://instagram.com/${username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                  >
                    View Profile <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-2">
              <Search className="w-8 h-8 opacity-20" />
              <p>Tidak ada hasil untuk &quot;{searchQuery}&quot;</p>
            </div>
          )}
        </div>
      </CardContent>

      <div className="px-6 py-3 border-t bg-muted/20 text-[10px] text-muted-foreground flex justify-between font-medium">
        <span>MENAMPILKAN {filtered.length} DARI {items.length} AKUN</span>
        {color === 'red' && <span>REKOMENDASI: UNFOLLOW</span>}
      </div>
    </Card>
  );
}
