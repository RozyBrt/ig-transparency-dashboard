// src/types/index.ts

// ═══════════════════════════════════════════════════════════
// PROFILING MODULE (Ads & Topics)
// ═══════════════════════════════════════════════════════════

export interface MetaCategory {
  label: string;          // Label profiling dari Meta
  group: string;          // Group asli dari Meta (dari JSON)
  autoGroup: string;      // Kelompok otomatis hasil klasifikasi
}

export interface Advertiser {
  name: string;           // Nama pengiklan
  type: string;           // Tipe hasil klasifikasi (e-commerce, tech, dll)
  sourceGroup: string;    // Group asli dari Meta
}

// ═══════════════════════════════════════════════════════════
// FOOTPRINT MODULE (Login & Links)
// ═══════════════════════════════════════════════════════════

export interface LoginEntry {
  timestamp: number;
  date: Date;
  ip: string;
  port: string;
  lang: string;
  userAgent: string;
  device: string;         // Hasil parsing: iPhone, Android Phone, Windows PC, dll
  browser: string;        // Hasil parsing: Chrome, Safari, Firefox, dll
  os: string;            // Hasil parsing: iOS, Android, Windows 10/11, dll
}

export interface LinkEntry {
  timestamp: number;
  date: Date;
  url: string;
  title: string;
  domain: string;        // Hasil ekstraksi dari URL
  duration: number | null; // Durasi dalam detik, null jika tidak ada
  startStr: string;      // String waktu mulai dari JSON
  endStr: string;        // String waktu selesai dari JSON
}

// ═══════════════════════════════════════════════════════════
// SOCIAL MODULE (Followers/Following Analysis)
// ═══════════════════════════════════════════════════════════

export interface FollowerEntry {
  username: string;
  timestamp: number;
  date: Date;
  href: string;
}

export interface FollowingEntry {
  username: string;
  timestamp: number;
  date: Date;
  href: string;
  followsBack: boolean;      // Apakah dia follow balik
  suspicious: boolean;        // Username mencurigakan (bot indicator)
}

// Hasil analisis mutual relationships
export interface SocialAnalysis {
  followers: FollowerEntry[];
  following: FollowingEntry[];
  mutuals: string[];           // Username yang saling follow
  notFollowBack: string[];     // Kamu follow tapi dia nggak follow balik
  notFollowingBack: string[];  // Dia follow tapi kamu nggak follow balik
  suspiciousFollowing: FollowingEntry[]; // Following dengan username mencurigakan
}

// ═══════════════════════════════════════════════════════════
// STORE STATE
// ═══════════════════════════════════════════════════════════

export interface IGStore {
  // Profiling
  categories: MetaCategory[];
  topics: string[];
  advertisers: Advertiser[];
  
  // Footprint
  loginActivity: LoginEntry[];
  linkHistory: LinkEntry[];
  
  // Social Module
  followers: FollowerEntry[];
  following: FollowingEntry[];
  socialAnalysis: SocialAnalysis | null;
  
  // Actions
  setCategories: (data: MetaCategory[]) => void;
  setTopics: (data: string[]) => void;
  setAdvertisers: (data: Advertiser[]) => void;
  setLoginActivity: (data: LoginEntry[]) => void;
  setLinkHistory: (data: LinkEntry[]) => void;
  setFollowers: (data: FollowerEntry[]) => void;
  setFollowing: (data: FollowingEntry[]) => void;
  setSocialAnalysis: (data: SocialAnalysis) => void;
  
  // Reset all
  reset: () => void;
}

// ═══════════════════════════════════════════════════════════
// RAW JSON STRUCTURES (untuk parser input type safety)
// ═══════════════════════════════════════════════════════════

export interface MetaCategoryJSON {
  label_values?: Array<{
    label: string;
    vec: Array<{ value: string }>;
  }>;
}

export interface TopicsJSON {
  topics_your_topics?: Array<{
    string_map_data?: {
      Name?: {
        value: string;
      };
    };
  }>;
}

export interface AdvertiserJSON {
  label_values?: Array<{
    label: string;
    vec: Array<{ value: string }>;
  }>;
}

export interface LoginActivityJSON {
  account_history_login_history?: Array<{
    string_map_data?: {
      'IP Address'?: { value: string };
      'Port'?: { value: string };
      'Language Code'?: { value: string };
      'Time'?: { timestamp: number };
      'User Agent'?: { value: string };
    };
  }>;
}

export interface LinkHistoryJSON {
  timestamp: number;
  label_values?: Array<{
    label: string;
    value: string;
  }>;
}

export interface FollowersJSON {
  string_list_data?: Array<{
    href: string;
    value: string;
    timestamp: number;
  }>;
}

export interface FollowingJSON {
  relationships_following?: Array<{
    title: string;
    string_list_data?: Array<{
      href: string;
      timestamp: number;
    }>;
  }>;
}
