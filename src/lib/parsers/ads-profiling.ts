// src/lib/parsers/ads-profiling.ts

import type {
  MetaCategory,
  Advertiser,
  MetaCategoryJSON,
  TopicsJSON,
  AdvertiserJSON,
} from '@/types';

// ═══════════════════════════════════════════════════════════
// CATEGORY PARSER
// ═══════════════════════════════════════════════════════════

export function parseCategories(data: MetaCategoryJSON): MetaCategory[] {
  const result: MetaCategory[] = [];
  const groups = data.label_values || [];

  groups.forEach((group) => {
    const groupName = group.label || 'Lainnya';
    (group.vec || []).forEach((item) => {
      if (item.value) {
        result.push({
          label: item.value,
          group: groupName,
          autoGroup: classifyCategory(item.value),
        });
      }
    });
  });

  return result;
}

/**
 * Klasifikasi label Meta ke dalam kategori yang lebih mudah dipahami
 */
function classifyCategory(label: string): string {
  const l = label.toLowerCase();

  if (l.includes('facebook') || l.includes('instagram') || l.includes('meta')) {
    return 'Platform Meta';
  }
  if (
    l.includes('android') ||
    l.includes('ios') ||
    l.includes('mobile') ||
    l.includes('device')
  ) {
    return 'Device & Platform';
  }
  if (
    l.includes('birthday') ||
    l.includes('age') ||
    l.includes('demographic')
  ) {
    return 'Demografi';
  }
  if (
    l.includes('shopper') ||
    l.includes('purchas') ||
    l.includes('buy') ||
    l.includes('commerce')
  ) {
    return 'Perilaku Belanja';
  }
  if (
    l.includes('interest') ||
    l.includes('hobby') ||
    l.includes('sport') ||
    l.includes('music') ||
    l.includes('game')
  ) {
    return 'Minat & Hobi';
  }
  if (
    l.includes('business') ||
    l.includes('admin') ||
    l.includes('page')
  ) {
    return 'Bisnis & Admin';
  }
  if (
    l.includes('location') ||
    l.includes('city') ||
    l.includes('country') ||
    l.includes('travel')
  ) {
    return 'Lokasi';
  }

  return 'Lainnya';
}

// ═══════════════════════════════════════════════════════════
// TOPICS PARSER
// ═══════════════════════════════════════════════════════════

export function parseTopics(data: TopicsJSON): string[] {
  const arr = data.topics_your_topics || [];
  
  return arr
    .map((item) => item.string_map_data?.Name?.value || '')
    .filter(Boolean);
}

// ═══════════════════════════════════════════════════════════
// ADVERTISER PARSER
// ═══════════════════════════════════════════════════════════

export function parseAdvertisers(data: AdvertiserJSON): Advertiser[] {
  const result: Advertiser[] = [];
  const groups = data.label_values || [];

  groups.forEach((group) => {
    const sourceGroup = group.label || 'Lainnya';
    (group.vec || []).forEach((item) => {
      if (item.value) {
        result.push({
          name: item.value,
          type: classifyAdvertiser(item.value),
          sourceGroup,
        });
      }
    });
  });

  return result;
}

/**
 * Klasifikasi nama pengiklan ke dalam tipe bisnis
 */
function classifyAdvertiser(name: string): string {
  const n = name.toLowerCase();

  if (
    n.includes('tokopedia') ||
    n.includes('shopee') ||
    n.includes('lazada') ||
    n.includes('blibli') ||
    n.includes('bukalapak')
  ) {
    return 'E-Commerce';
  }
  if (
    n.includes('bank') ||
    n.includes('finance') ||
    n.includes('insurance') ||
    n.includes('invest') ||
    n.includes('dompet')
  ) {
    return 'Keuangan';
  }
  if (
    n.includes('uni') ||
    n.includes('college') ||
    n.includes('school') ||
    n.includes('course') ||
    n.includes('bimbel') ||
    n.includes('edu')
  ) {
    return 'Pendidikan';
  }
  if (
    n.includes('gov') ||
    n.includes('kemen') ||
    n.includes('bpjs') ||
    n.includes('pemerintah')
  ) {
    return 'Pemerintah';
  }
  if (
    n.includes('adobe') ||
    n.includes('notion') ||
    n.includes('google') ||
    n.includes('microsoft') ||
    n.includes('apple') ||
    n.includes('software')
  ) {
    return 'Tech & Software';
  }
  if (
    n.includes('fashion') ||
    n.includes('cloth') ||
    n.includes('apparel') ||
    n.includes('wear')
  ) {
    return 'Fashion';
  }
  if (
    n.includes('food') ||
    n.includes('resto') ||
    n.includes('cafe') ||
    n.includes('coffee') ||
    n.includes('kuliner')
  ) {
    return 'Makanan & Minuman';
  }
  if (
    n.includes('media') ||
    n.includes('news') ||
    n.includes('tv') ||
    n.includes('entertainment') ||
    n.includes('music')
  ) {
    return 'Media & Hiburan';
  }
  if (
    n.includes('health') ||
    n.includes('pharma') ||
    n.includes('medis') ||
    n.includes('doctor') ||
    n.includes('klinik')
  ) {
    return 'Kesehatan';
  }

  return 'Lainnya';
}
