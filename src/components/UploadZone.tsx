"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useIGStore } from "@/lib/store";
import { parseCategories, parseTopics, parseAdvertisers } from "@/lib/parsers/ads-profiling";
import { parseLoginActivity, parseLinkHistory } from "@/lib/parsers/digital-footprint";
import { parseFollowers, parseFollowing, analyzeSocialRelationship } from "@/lib/parsers/social";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileJson, CheckCircle2, AlertCircle, Loader2, Folder, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function UploadZone() {
  const store = useIGStore();
  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setStatus({ type: "loading", message: "Menganalisis file..." });

      try {
        for (const file of acceptedFiles) {
          const text = await file.text();
          const json = JSON.parse(text);
          const fileName = file.name.toLowerCase();

          // Auto-detect based on JSON structure or filename
          if (json.label_values && fileName.includes("your_topics")) {
            // This is actually advertisers or categories sometimes depending on the file
            // Let's check the structure more deeply if needed, but for now simple check:
            if (fileName.includes("advertisers")) {
               store.setAdvertisers(parseAdvertisers(json));
            } else {
               store.setCategories(parseCategories(json));
            }
          } 
          else if (json.topics_your_topics) {
            store.setTopics(parseTopics(json));
          }
          else if (json.label_values && (fileName.includes("advertisers") || fileName.includes("ads"))) {
            store.setAdvertisers(parseAdvertisers(json));
          }
          else if (json.account_history_login_history || json.login_history || json.login_activity) {
            // Handle multiple possible keys for login activity
            const loginData = json.account_history_login_history || json.login_history || json.login_activity || [];
            store.setLoginActivity(parseLoginActivity({ account_history_login_history: loginData }));
          }
          // Lebih fleksibel mendeteksi Link History (biasanya array of objects dengan label_values)
          else if (Array.isArray(json) && (json.length === 0 || json[0].label_values || fileName.includes("link_history"))) {
            store.setLinkHistory(parseLinkHistory(json));
          }
          else if (json.browser_history_link_history) {
            // Kadang dibungkus dalam property ini
            store.setLinkHistory(parseLinkHistory(json.browser_history_link_history));
          }
          else if (fileName.includes("followers") || fileName.includes("pengikut")) {
            const followers = parseFollowers(json);
            store.setFollowers(followers);
            // Re-analyze if following already exists
            if (store.following.length > 0) {
              store.setSocialAnalysis(analyzeSocialRelationship(followers, store.following));
            }
          }
          else if (json.relationships_following) {
            const following = parseFollowing(json);
            store.setFollowing(following);
            // Re-analyze if followers already exist
            if (store.followers.length > 0) {
              store.setSocialAnalysis(analyzeSocialRelationship(store.followers, following));
            }
          }
          else if (json.label_values && !fileName.includes("topics")) {
             // Fallback to categories for label_values
             store.setCategories(parseCategories(json));
          }
        }

        setStatus({
          type: "success",
          message: `${acceptedFiles.length} file berhasil diproses!`,
        });
        
        setTimeout(() => setStatus({ type: "idle", message: "" }), 3000);
      } catch (error) {
        console.error("Parsing error:", error);
        setStatus({
          type: "error",
          message: "Gagal membaca file. Pastikan formatnya JSON Instagram asli.",
        });
      }
    },
    [store]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/json": [".json"],
    },
  });

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "relative group cursor-pointer overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300",
          isDragActive
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-muted-foreground/20 hover:border-primary/50 hover:bg-accent/50"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-4">
          <div className={cn(
            "p-4 rounded-full bg-background shadow-sm transition-transform duration-300 group-hover:scale-110",
            isDragActive && "scale-110 text-primary"
          )}>
            <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          
          <div className="space-y-1">
            <p className="text-lg font-semibold tracking-tight">
              {isDragActive ? "Lepaskan file di sini" : "Upload Data Instagram"}
            </p>
            <p className="text-sm text-muted-foreground">
              Tarik & lepas file JSON dari folder ekspor Meta kamu.
            </p>
          </div>

          <div className="w-full max-w-lg grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50 border border-muted-foreground/10">
              <Folder className="w-4 h-4 mb-2 text-primary/60" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Ads Info</span>
              <span className="text-[10px] font-mono bg-background px-2 py-1 rounded">ads_information/</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50 border border-muted-foreground/10">
              <Folder className="w-4 h-4 mb-2 text-primary/60" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Footprint</span>
              <span className="text-[10px] font-mono bg-background px-2 py-1 rounded truncate w-full">security_and_login_...</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50 border border-muted-foreground/10">
              <Folder className="w-4 h-4 mb-2 text-primary/60" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Social</span>
              <span className="text-[10px] font-mono bg-background px-2 py-1 rounded truncate w-full">connections/follow...</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 items-center">
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-accent/30 px-3 py-1 rounded-full border border-primary/10">
              <Info className="w-3 h-3" />
              <span>Gunakan file <b>login_activity.json</b> & <b>link_history.json</b></span>
            </div>
          </div>
        </div>
      </div>

      {status.type !== "idle" && (
        <Card className={cn(
          "p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300",
          status.type === "error" ? "border-destructive/50 bg-destructive/5" : "border-primary/20 bg-primary/5"
        )}>
          {status.type === "loading" && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
          {status.type === "success" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
          {status.type === "error" && <AlertCircle className="w-5 h-5 text-destructive" />}
          <span className="text-sm font-medium">{status.message}</span>
        </Card>
      )}
    </div>
  );
}
