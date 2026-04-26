// src/constants/fileMapping.ts

export const FILE_MAPPING = {
  // ─────────────────────────────────────────────────────
  // ADS PROFILING MODULE
  // ─────────────────────────────────────────────────────
  PROFILING: [
    {
      id: 'categories',
      name: 'Meta Categories',
      filename: 'other_categories_used_to_reach_you.json',
      path: 'ads_information/instagram_ads_and_businesses/other_categories_used_to_reach_you.json',
      icon: '📋',
      description: 'Label profiling yang Meta tempel ke akun kamu',
      hint: 'ads_information → instagram_ads_and_businesses → other_categories_used_to_reach_you.json',
      required: true,
    },
    {
      id: 'topics',
      name: 'Recommended Topics',
      filename: 'recommended_topics.json',
      path: 'preferences/your_topics/recommended_topics.json',
      icon: '💭',
      description: 'Topik minat yang diasumsikan algoritma Meta',
      hint: 'preferences → your_topics → recommended_topics.json',
      required: true,
    },
    {
      id: 'advertisers',
      name: 'Advertisers Data',
      filename: 'advertisers_using_your_activity_or_information.json',
      path: 'ads_information/instagram_ads_and_businesses/advertisers_using_your_activity_or_information.json',
      icon: '📢',
      description: 'Entitas bisnis yang pakai datamu untuk targeting iklan',
      hint: 'ads_information → instagram_ads_and_businesses → advertisers_using_your_activity_or_information.json',
      required: true,
    },
  ],

  // ─────────────────────────────────────────────────────
  // DIGITAL FOOTPRINT MODULE
  // ─────────────────────────────────────────────────────
  FOOTPRINT: [
    {
      id: 'login',
      name: 'Login Activity',
      filename: 'login_activity.json',
      path: 'security_and_login_information/login_and_profile_creation/login_activity.json',
      icon: '🔐',
      description: 'Riwayat login akun, IP, device, dan browser yang dipakai',
      hint: 'security_and_login_information → login_and_profile_creation → login_activity.json',
      required: true,
    },
    {
      id: 'links',
      name: 'Link History',
      filename: 'link_history.json',
      path: 'logged_information/link_history/link_history.json',
      icon: '🔗',
      description: 'Link yang pernah kamu klik dari Instagram browser',
      hint: 'logged_information → link_history → link_history.json',
      required: true,
    },
  ],

  // ─────────────────────────────────────────────────────
  // SOCIAL AUDIT MODULE
  // ─────────────────────────────────────────────────────
  SOCIAL: [
    {
      id: 'followers',
      name: 'Followers List',
      filename: 'followers_1.json',
      path: 'connections/followers_and_following/followers_1.json',
      icon: '👥',
      description: 'Daftar orang yang follow kamu',
      hint: 'connections → followers_and_following → followers_1.json',
      required: true,
    },
    {
      id: 'following',
      name: 'Following List',
      filename: 'following.json',
      path: 'connections/followers_and_following/following.json',
      icon: '📋',
      description: 'Daftar orang yang kamu follow',
      hint: 'connections → followers_and_following → following.json',
      required: true,
    },
  ],
};

export type FileType =
  | 'categories'
  | 'topics'
  | 'advertisers'
  | 'login'
  | 'links'
  | 'followers'
  | 'following';

export function getFileMapping(id: FileType) {
  for (const module of [
    ...FILE_MAPPING.PROFILING,
    ...FILE_MAPPING.FOOTPRINT,
    ...FILE_MAPPING.SOCIAL,
  ]) {
    if (module.id === id) return module;
  }
  return null;
}
