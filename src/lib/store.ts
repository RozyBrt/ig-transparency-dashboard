// src/lib/store.ts

import { create } from 'zustand';
import type {
  IGStore,
  MetaCategory,
  Advertiser,
  LoginEntry,
  LinkEntry,
  FollowerEntry,
  FollowingEntry,
} from '@/types';

export const useIGStore = create<IGStore>((set) => ({
  // ─────────────────────────────────────────────────────────
  // Initial State
  // ─────────────────────────────────────────────────────────
  
  categories: [],
  topics: [],
  advertisers: [],
  loginActivity: [],
  linkHistory: [],
  followers: [],
  following: [],

  // ─────────────────────────────────────────────────────────
  // Actions - Profiling Module
  // ─────────────────────────────────────────────────────────

  setCategories: (data: MetaCategory[]) =>
    set((state) => ({
      ...state,
      categories: data,
    })),

  setTopics: (data: string[]) =>
    set((state) => ({
      ...state,
      topics: data,
    })),

  setAdvertisers: (data: Advertiser[]) =>
    set((state) => ({
      ...state,
      advertisers: data,
    })),

  // ─────────────────────────────────────────────────────────
  // Actions - Footprint Module
  // ─────────────────────────────────────────────────────────

  setLoginActivity: (data: LoginEntry[]) =>
    set((state) => ({
      ...state,
      loginActivity: data,
    })),

  setLinkHistory: (data: LinkEntry[]) =>
    set((state) => ({
      ...state,
      linkHistory: data,
    })),

  // ─────────────────────────────────────────────────────────
  // Actions - Social Module (untuk nanti)
  // ─────────────────────────────────────────────────────────

  setFollowers: (data: FollowerEntry[]) =>
    set((state) => ({
      ...state,
      followers: data,
    })),

  setFollowing: (data: FollowingEntry[]) =>
    set((state) => ({
      ...state,
      following: data,
    })),

  // ─────────────────────────────────────────────────────────
  // Reset - Clear all data
  // ─────────────────────────────────────────────────────────

  reset: () =>
    set({
      categories: [],
      topics: [],
      advertisers: [],
      loginActivity: [],
      linkHistory: [],
      followers: [],
      following: [],
    }),
}));
