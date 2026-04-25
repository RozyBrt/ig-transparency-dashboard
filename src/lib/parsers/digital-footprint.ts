// src/lib/parsers/digital-footprint.ts

import type {
  LoginEntry,
  LinkEntry,
  LoginActivityJSON,
  LinkHistoryJSON,
} from '@/types';

// ═══════════════════════════════════════════════════════════
// LOGIN ACTIVITY PARSER
// ═══════════════════════════════════════════════════════════

export function parseLoginActivity(data: LoginActivityJSON): LoginEntry[] {
  const arr = data.account_history_login_history || [];

  return arr
    .map((item) => {
      const d = item.string_map_data || {};
      const ts = d['Time']?.timestamp || 0;
      const ua = d['User Agent']?.value || '';

      return {
        timestamp: ts,
        date: ts ? new Date(ts * 1000) : new Date(),
        ip: d['IP Address']?.value || '—',
        port: d['Port']?.value || '',
        lang: d['Language Code']?.value || '',
        userAgent: ua,
        device: parseDevice(ua),
        browser: parseBrowser(ua),
        os: parseOS(ua),
      };
    })
    .filter((x) => x.timestamp > 0)
    .sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Ekstraksi jenis device dari User Agent string
 */
function parseDevice(ua: string): string {
  if (!ua) return 'Unknown';
  if (/iPhone/i.test(ua)) return 'iPhone';
  if (/iPad/i.test(ua)) return 'iPad';
  if (/Android.*Mobile/i.test(ua)) return 'Android Phone';
  if (/Android/i.test(ua)) return 'Android Tablet';
  if (/Windows NT/i.test(ua)) return 'Windows PC';
  if (/Macintosh/i.test(ua)) return 'Mac';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Other';
}

/**
 * Ekstraksi browser dari User Agent string
 */
function parseBrowser(ua: string): string {
  if (!ua) return 'Unknown';
  if (/Edg\//i.test(ua)) return 'Edge';
  if (/OPR\//i.test(ua) || /Opera/i.test(ua)) return 'Opera';
  if (/Chrome/i.test(ua) && !/Chromium/i.test(ua)) return 'Chrome';
  if (/Firefox/i.test(ua)) return 'Firefox';
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return 'Safari';
  if (/MSIE|Trident/i.test(ua)) return 'IE';
  return 'Other';
}

/**
 * Ekstraksi OS dari User Agent string
 */
function parseOS(ua: string): string {
  if (!ua) return 'Unknown';
  if (/Windows NT 10/i.test(ua)) return 'Windows 10/11';
  if (/Windows NT/i.test(ua)) return 'Windows';
  if (/Mac OS X/i.test(ua)) return 'macOS';
  if (/Android/i.test(ua)) return 'Android';
  if (/iPhone|iPad/i.test(ua)) return 'iOS';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Unknown';
}

// ═══════════════════════════════════════════════════════════
// LINK HISTORY PARSER
// ═══════════════════════════════════════════════════════════

export function parseLinkHistory(
  data: LinkHistoryJSON[] | { timestamp: number; label_values: any[] }[]
): LinkEntry[] {
  const arr = Array.isArray(data) ? data : [];

  return arr
    .map((item) => {
      const labels = item.label_values || [];
      const get = (label: string) =>
        labels.find((l: any) => l.label === label)?.value || '';

      const url = get('Website link you visited');
      const title = get('Title of website page you visited');
      const startStr = get('Website session start time');
      const endStr = get('Website session end time');
      const ts = item.timestamp || 0;
      const domain = extractDomain(url);

      // Calculate duration in seconds
      let duration: number | null = null;
      if (startStr && endStr) {
        const s = new Date(startStr);
        const e = new Date(endStr);
        if (!isNaN(s.getTime()) && !isNaN(e.getTime())) {
          duration = Math.round((e.getTime() - s.getTime()) / 1000);
        }
      }

      return {
        timestamp: ts,
        date: ts ? new Date(ts * 1000) : new Date(),
        url,
        title,
        domain,
        duration,
        startStr,
        endStr,
      };
    })
    .filter((x) => x.url)
    .sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Ekstraksi domain dari URL
 * Contoh: https://www.hutacode.com/abc → hutacode.com
 */
function extractDomain(url: string): string {
  if (!url) return '—';
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '');
  } catch {
    // Fallback jika URL tidak valid
    const match = url.match(/([a-z0-9-]+\.[a-z]{2,})/i);
    return match ? match[1] : '—';
  }
}
