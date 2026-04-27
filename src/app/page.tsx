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

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"upload" | "profiling" | "footprint" | "social">("upload");
  const { reset } = useIGStore();

  const menuItems = [
    { id: "upload", label: "Upload Center", icon: LayoutDashboard },
    { id: "profiling", label: "Ads Profiling", icon: UserCircle },
    { id: "footprint", label: "Digital Footprint", icon: History },
    { id: "social", label: "Social Analysis", icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-muted/30">
        <div className="p-6 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 text-white shadow-lg shadow-purple-500/20">
            <Instagram className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold tracking-tight">IG Analyzer</h1>
            <p className="text-[10px] text-muted-foreground uppercase font-semibold">Data Transparency</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as "upload" | "profiling" | "footprint" | "social")}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={reset}
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Reset Session
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 border-b flex items-center justify-between px-8 bg-background/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span>Local Analysis Only</span>
          </div>
          
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon">
               <Settings className="w-4 h-4" />
             </Button>
             <div className="h-8 w-8 rounded-full bg-accent animate-pulse" />
          </div>
        </header>

        <div className="p-8 max-w-5xl mx-auto">
          {activeTab === "upload" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Upload Center</h2>
                <p className="text-muted-foreground">Mulai dengan meng-upload file JSON hasil download data Instagram kamu.</p>
              </div>
              <UploadZone />
            </div>
          )}

          {activeTab === "profiling" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Ads & Topics Profiling</h2>
                <p className="text-muted-foreground">Bagaimana Meta melihat preferensi dan minat kamu untuk pengiklan.</p>
              </div>
              <ProfilingModule />
            </div>
          )}

          {activeTab === "footprint" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Digital Footprint</h2>
                <p className="text-muted-foreground">Jejak aktivitas login dan riwayat link yang pernah kamu kunjungi.</p>
              </div>
              <FootprintModule />
            </div>
          )}

          {activeTab === "social" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Social Analysis</h2>
                <p className="text-muted-foreground">Analisis followers, following, dan deteksi akun mencurigakan.</p>
              </div>
              <SocialModule />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
