// src/app/page.tsx

"use client";

import React, { useState } from "react";
import { UploadZone } from "@/components/UploadZone";
import { ProfilingModule } from "@/components/modules/ProfilingModule";
import { FootprintModule } from "@/components/modules/FootprintModule";
import { SocialModule } from "@/components/modules/SocialModule";
import { useIGStore } from "@/lib/store";
import { 
  LayoutDashboard, 
  UserCircle, 
  History, 
  Trash2, 
  Settings,
  ShieldCheck,
  Instagram,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type TabID = "upload" | "profiling" | "footprint" | "social";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabID>("upload");
  const { reset } = useIGStore();

  const menuItems = [
    { id: "upload" as TabID, label: "Upload", fullLabel: "Upload Center", icon: LayoutDashboard },
    { id: "profiling" as TabID, label: "Profiling", fullLabel: "Ads Profiling", icon: UserCircle },
    { id: "footprint" as TabID, label: "Footprint", fullLabel: "Digital Footprint", icon: History },
    { id: "social" as TabID, label: "Social", fullLabel: "Social Analysis", icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-50">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden md:flex w-64 flex-col border-r border-zinc-800 bg-zinc-900/50">
        <div className="p-6 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 text-white shadow-lg shadow-purple-500/20">
            <Instagram className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold tracking-tight">IG Analyzer</h1>
            <p className="text-[10px] text-zinc-500 uppercase font-semibold">Data Transparency</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.fullLabel}
              </button>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={reset}
            className="w-full justify-start text-zinc-500 hover:text-red-400 hover:bg-red-400/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Reset Session
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-24 md:pb-0">
        {/* Header */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-4 md:px-8 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2 text-[10px] md:text-sm text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span className="font-medium">Local Analysis Only</span>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4">
             <Button variant="ghost" size="icon" className="text-zinc-400">
               <Settings className="w-4 h-4" />
             </Button>
             <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700 animate-pulse" />
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
          {activeTab === "upload" && (
            <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-100">Upload Center</h2>
                <p className="text-sm md:text-base text-zinc-500">Mulai dengan meng-upload file JSON hasil download data Instagram kamu.</p>
              </div>
              <UploadZone />
            </div>
          )}

          {activeTab === "profiling" && (
            <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-100">Ads & Topics Profiling</h2>
                <p className="text-sm md:text-base text-zinc-500">Bagaimana Meta melihat preferensi dan minat kamu untuk pengiklan.</p>
              </div>
              <ProfilingModule />
            </div>
          )}

          {activeTab === "footprint" && (
            <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-100">Digital Footprint</h2>
                <p className="text-sm md:text-base text-zinc-500">Jejak aktivitas login dan riwayat link yang pernah kamu kunjungi.</p>
              </div>
              <FootprintModule />
            </div>
          )}

          {activeTab === "social" && (
            <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-100">Social Analysis</h2>
                <p className="text-sm md:text-base text-zinc-500">Analisis followers, following, dan deteksi akun mencurigakan.</p>
              </div>
              <SocialModule />
            </div>
          )}
        </div>
      </main>

      {/* Mobile Navigation - Fixed Bottom */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800 md:hidden z-50 px-2">
        <div className="grid grid-cols-4 h-full items-center">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="flex flex-col items-center justify-center gap-1.5 transition-all"
              >
                <div className={cn(
                  "p-2 rounded-xl transition-all",
                  isActive ? "bg-primary/20 text-primary" : "text-zinc-500"
                )}>
                  <Icon className={cn("w-5 h-5", isActive && "fill-current")} />
                </div>
                <span className={cn(
                  "text-[10px] font-bold tracking-tight uppercase",
                  isActive ? "text-primary" : "text-zinc-600"
                )}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
