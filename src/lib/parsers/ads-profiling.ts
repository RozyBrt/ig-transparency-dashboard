// src/lib/parsers/ads-profiling.ts

import type {
  MetaCategory,
  Advertiser,
  MetaCategoryJSON,
  TopicsJSON,
  AdvertiserJSON,
} from '@/types';

// ═══════════════════════════════════════════════════════════
// EXPANDED KEYWORD DICTIONARIES
// ═══════════════════════════════════════════════════════════

const CATEGORY_KEYWORDS: Record<string, { keywords: string[]; icon: string }> = {
  // Existing categories
  'Platform Meta': {
    keywords: ['facebook', 'instagram', 'meta', 'whatsapp', 'threads'],
    icon: '📱',
  },
  'Device & Platform': {
    keywords: [
      'android',
      'ios',
      'mobile',
      'device',
      'iphone',
      'ipad',
      'windows',
      'mac',
      'linux',
      'browser',
    ],
    icon: '💻',
  },
  Demografi: {
    keywords: [
      'birthday',
      'age',
      'demographic',
      'gender',
      'relationship',
      'language',
      'location',
    ],
    icon: '👤',
  },

  // NEW CATEGORIES
  'Perilaku Belanja': {
    keywords: [
      'shopper',
      'purchas',
      'buy',
      'commerce',
      'cart',
      'checkout',
      'payment',
      'spend',
      'budget',
      'seller',
    ],
    icon: '🛍️',
  },
  'Minat & Hobi': {
    keywords: [
      'interest',
      'hobby',
      'sport',
      'music',
      'game',
      'gaming',
      'art',
      'photography',
      'travel',
      'outdoor',
      'fitness',
      'wellness',
    ],
    icon: '🎮',
  },
  'Lifestyle & Fashion': {
    keywords: [
      'fashion',
      'cloth',
      'apparel',
      'wear',
      'style',
      'beauty',
      'cosmetic',
      'makeup',
      'skincare',
      'luxury',
      'brand',
      'designer',
      'lifestyle',
    ],
    icon: '👗',
  },
  'Entertainment & Gaming': {
    keywords: [
      'entertainment',
      'movie',
      'film',
      'tv',
      'series',
      'show',
      'music',
      'concert',
      'game',
      'gaming',
      'esports',
      'streaming',
      'netflix',
      'youtube',
    ],
    icon: '🎬',
  },
  'Bisnis & Admin': {
    keywords: [
      'business',
      'admin',
      'page',
      'management',
      'professional',
      'work',
      'career',
      'job',
      'recruitment',
    ],
    icon: '💼',
  },
  Lokasi: {
    keywords: [
      'location',
      'city',
      'country',
      'travel',
      'tourism',
      'hotel',
      'flight',
      'transport',
      'navigation',
    ],
    icon: '📍',
  },
  'Makanan & Minuman': {
    keywords: [
      'food',
      'resto',
      'cafe',
      'coffee',
      'kuliner',
      'cooking',
      'recipe',
      'dining',
      'drink',
      'beverage',
      'restaurant',
    ],
    icon: '🍔',
  },
  'Kesehatan & Wellness': {
    keywords: [
      'health',
      'pharma',
      'medis',
      'doctor',
      'klinik',
      'medicine',
      'wellness',
      'fitness',
      'gym',
      'nutrition',
      'diet',
      'mental',
    ],
    icon: '🏥',
  },
  'E-commerce Giant': {
    keywords: [
      'tokopedia',
      'shopee',
      'lazada',
      'blibli',
      'bukalapak',
      'amazon',
      'alibaba',
      'ebay',
      'marketplace',
      'ecommerce',
    ],
    icon: '🏪',
  },
  'Fintech & Keuangan': {
    keywords: [
      'bank',
      'finance',
      'financial',
      'insurance',
      'invest',
      'dompet',
      'payment',
      'crypto',
      'bitcoin',
      'trading',
      'loan',
      'credit',
    ],
    icon: '💰',
  },
  Pendidikan: {
    keywords: [
      'uni',
      'university',
      'college',
      'school',
      'course',
      'bimbel',
      'edu',
      'education',
      'learning',
      'training',
      'bootcamp',
    ],
    icon: '🎓',
  },
  'Media & Berita': {
    keywords: [
      'media',
      'news',
      'tv',
      'newspaper',
      'journalism',
      'content',
      'publication',
    ],
    icon: '📰',
  },
};

// ═══════════════════════════════════════════════════════════
// DATA SOURCE KEYWORDS (Metadata Source Detection)
// ═══════════════════════════════════════════════════════════

const DATA_SOURCE_PATTERNS: Record<string, { 
  keywords: string[]; 
  description: string; 
  icon: string; 
  severity: 'low' | 'medium' | 'high' 
}> = {
  'Uploaded Email': {
    keywords: ['upload', 'email', 'contact', 'list', 'customer', 'match'],
    description: 'Email kamu di-upload oleh advertiser',
    icon: '📧',
    severity: 'high', // Privacy concern level
  },
  'Website Activity': {
    keywords: ['website', 'pixel', 'tracking', 'visit', 'behavior', 'activity', 'web', 'page'],
    description: 'Aktivitas kamu di website mereka dipantau',
    icon: '🌐',
    severity: 'medium',
  },
  'App Activity': {
    keywords: ['app', 'mobile', 'application', 'sdk', 'install', 'engagement'],
    description: 'Data dari app yang kamu install',
    icon: '📲',
    severity: 'medium',
  },
  'Social Interaction': {
    keywords: ['interaction', 'engagement', 'like', 'comment', 'share', 'follow', 'visit'],
    description: 'Berdasarkan interaksi kamu dengan konten mereka',
    icon: '💬',
    severity: 'low',
  },
  'Offline Data': {
    keywords: ['offline', 'store', 'purchase', 'transaction', 'receipt', 'pos'],
    description: 'Data pembelian offline yang di-link ke akun kamu',
    icon: '🏬',
    severity: 'high',
  },
  'Partner Network': {
    keywords: ['partner', 'network', 'collaboration', 'third-party', 'integration'],
    description: 'Data dibagikan melalui network partner Meta',
    icon: '🤝',
    severity: 'medium',
  },
};

// ═══════════════════════════════════════════════════════════
// CATEGORY PARSER (EXPANDED)
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
 * Menggunakan expanded keyword dictionary
 */
function classifyCategory(label: string): string {
  const l = label.toLowerCase();

  // Iterate through all categories and find match
  for (const [categoryName, data] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of data.keywords) {
      if (l.includes(keyword)) {
        return categoryName;
      }
    }
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
// ADVERTISER PARSER (EXPANDED WITH DATA SOURCE)
// ═══════════════════════════════════════════════════════════

export function parseAdvertisers(data: AdvertiserJSON): Advertiser[] {
  const result: Advertiser[] = [];
  const groups = data.label_values || [];

  groups.forEach((group) => {
    const sourceGroup = group.label || 'Lainnya';
    const dataSource = detectDataSource(sourceGroup);

    (group.vec || []).forEach((item) => {
      if (item.value) {
        result.push({
          name: item.value,
          type: classifyAdvertiser(item.value),
          sourceGroup,
          dataSource: dataSource || undefined,
          dataSeverity: dataSource?.severity || 'low',
        });
      }
    });
  });

  return result;
}

/**
 * Klasifikasi nama pengiklan ke dalam tipe bisnis (EXPANDED)
 */
function classifyAdvertiser(name: string): string {
  const n = name.toLowerCase();

  for (const [categoryName, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords.keywords) {
      if (n.includes(keyword)) {
        return categoryName;
      }
    }
  }

  return 'Lainnya';
}

/**
 * Deteksi sumber data pengiklan berdasarkan metadata source label
 * Menganalisa GIMANA advertiser dapet data kamu
 */
function detectDataSource(
  sourceLabel: string
): { name: string; description: string; icon: string; severity: 'low' | 'medium' | 'high' } | null {
  const label = sourceLabel.toLowerCase();

  // Check against all data source patterns
  for (const [sourceName, pattern] of Object.entries(DATA_SOURCE_PATTERNS)) {
    for (const keyword of pattern.keywords) {
      if (label.includes(keyword)) {
        return {
          name: sourceName,
          description: pattern.description,
          icon: pattern.icon,
          severity: pattern.severity,
        };
      }
    }
  }

  return null;
}

// ═══════════════════════════════════════════════════════════
// HELPER: Get All Category Icons & Names
// ═══════════════════════════════════════════════════════════

export function getCategoryMetadata() {
  return Object.entries(CATEGORY_KEYWORDS).map(([name, data]) => ({
    name,
    icon: data.icon,
  }));
}

// ═══════════════════════════════════════════════════════════
// HELPER: Get All Data Source Information
// ═══════════════════════════════════════════════════════════

export function getDataSourceMetadata() {
  return Object.entries(DATA_SOURCE_PATTERNS).map(([name, pattern]) => ({
    name,
    description: pattern.description,
    icon: pattern.icon,
    severity: pattern.severity,
    keywords: pattern.keywords,
  }));
}
