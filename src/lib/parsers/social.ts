// src/lib/parsers/social.ts

import type {
  FollowerEntry,
  FollowingEntry,
  SocialAnalysis,
} from '@/types';

// ═══════════════════════════════════════════════════════════
// FOLLOWERS PARSER
// ═══════════════════════════════════════════════════════════

interface RawFollowerItem {
  title?: string;
  href?: string;
  timestamp?: number;
  string_list_data?: Array<{
    href: string;
    value: string;
    timestamp: number;
  }>;
}

export function parseFollowers(data: RawFollowerItem[] | { string_list_data: RawFollowerItem[] }): FollowerEntry[] {
  const rawArr = Array.isArray(data) ? data : data.string_list_data || [];
  
  return rawArr
    .map((item: RawFollowerItem) => {
      const stringData = item.string_list_data?.[0] || {};
      const username = stringData.value || item.title || "";
      const ts = stringData.timestamp || item.timestamp || 0;

      return {
        username,
        timestamp: ts,
        date: ts ? new Date(ts * 1000) : new Date(),
        href: stringData.href || item.href || `https://instagram.com/${username}`,
      };
    })
    .filter((x) => x.username)
    .sort((a, b) => b.timestamp - a.timestamp);
}

// ═══════════════════════════════════════════════════════════
// FOLLOWING PARSER
// ═══════════════════════════════════════════════════════════

interface RawFollowingItem {
  title?: string;
  href?: string;
  timestamp?: number;
  string_list_data?: Array<{
    href: string;
    value: string;
    timestamp: number;
  }>;
}

export function parseFollowing(data: { relationships_following?: RawFollowingItem[] } | RawFollowingItem[]): FollowingEntry[] {
  const rawArr = ('relationships_following' in data) 
    ? data.relationships_following || [] 
    : (Array.isArray(data) ? data : []);

  return rawArr
    .map((item: RawFollowingItem) => {
      const stringData = item.string_list_data?.[0] || {};
      const username = item.title || stringData.value || "";
      const ts = stringData.timestamp || item.timestamp || 0;

      return {
        username,
        timestamp: ts,
        date: ts ? new Date(ts * 1000) : new Date(),
        href: stringData.href || item.href || `https://instagram.com/${username}`,
        followsBack: false,
        suspicious: isSuspiciousUsername(username),
      };
    })
    .filter((x) => x.username)
    .sort((a, b) => b.timestamp - a.timestamp);
}

// ═══════════════════════════════════════════════════════════
// SOCIAL ANALYSIS - Compare Followers vs Following
// ═══════════════════════════════════════════════════════════

export function analyzeSocialRelationship(
  followers: FollowerEntry[],
  following: FollowingEntry[]
): SocialAnalysis {
  const followerSet = new Set(followers.map((f) => f.username));
  const followingSet = new Set(following.map((f) => f.username));

  // Enrich following dengan followsBack info
  const enrichedFollowing = following.map((f) => ({
    ...f,
    followsBack: followerSet.has(f.username),
  }));

  // Calculate relationships
  const mutuals = Array.from(followerSet).filter((username) =>
    followingSet.has(username)
  );

  const notFollowBack = enrichedFollowing
    .filter((f) => !f.followsBack)
    .map((f) => f.username);

  const notFollowingBack = Array.from(followerSet)
    .filter((username) => !followingSet.has(username))
    .map((username) => username);

  const suspiciousFollowing = enrichedFollowing.filter((f) => f.suspicious);

  return {
    followers,
    following: enrichedFollowing,
    mutuals,
    notFollowBack,
    notFollowingBack,
    suspiciousFollowing,
  };
}

// ═══════════════════════════════════════════════════════════
// HELPER: Detect Suspicious Username (Bot Indicator)
// ═══════════════════════════════════════════════════════════

function isSuspiciousUsername(username: string): boolean {
  if (!username) return false;

  const lowerUsername = username.toLowerCase();

  // Pattern 1: Terlalu banyak angka (bot-like)
  const numberRatio = (username.match(/\d/g) || []).length / username.length;
  if (numberRatio > 0.5) return true;

  // Pattern 2: Angka panjang di akhir (misal: username_12345678)
  if (/[a-z_]+\d{5,}$/.test(lowerUsername)) return true;

  // Pattern 3: Hanya random character (misal: asdf1234, xyzabc)
  if (/^[a-z0-9]{6,12}$/.test(lowerUsername) && numberRatio > 0.4) return true;

  // Pattern 4: Jelas bot keyword
  if (
    lowerUsername.includes('bot') ||
    lowerUsername.includes('promo') ||
    lowerUsername.includes('spam') ||
    lowerUsername.includes('seller') ||
    lowerUsername.includes('shop')
  ) {
    return true;
  }

  // Pattern 5: Karakter aneh (underscore berkali-kali)
  if (/_{2,}/.test(username)) return true;

  return false;
}

// ═══════════════════════════════════════════════════════════
// STATISTICS HELPER
// ═══════════════════════════════════════════════════════════

export function getSocialStats(analysis: SocialAnalysis) {
  return {
    totalFollowers: analysis.followers.length,
    totalFollowing: analysis.following.length,
    mutualCount: analysis.mutuals.length,
    notFollowBackCount: analysis.notFollowBack.length,
    notFollowingBackCount: analysis.notFollowingBack.length,
    suspiciousCount: analysis.suspiciousFollowing.length,
    followbackRatio: analysis.following.length > 0 
      ? ((analysis.mutuals.length / analysis.following.length) * 100).toFixed(1)
      : "0",
  };
}
