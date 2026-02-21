import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DashboardPage {
  id: string;
  slug: string;
  displayName: string;
  bio?: string;
  themeId: string;
}

export interface CachedLink {
  id?: string;
  title: string;
  url: string;
  order: number;
  is_active: boolean;
  expires_at?: string | null;
  coming_soon_message?: string | null;
}

export interface CachedSocialIcon {
  platform: string;
  url: string;
  order: number;
  coming_soon_message?: string | null;
}

export interface CachedTranslation {
  id?: string;
  language_code: string;
  display_name?: string;
  bio?: string;
}

export interface CachedPageData {
  slug: string;
  displayName: string;
  bio: string;
  themeId: string;
  avatarUrl: string;
  languages: string[];
  links: CachedLink[];
  socialIcons: CachedSocialIcon[];
  translations: Record<string, CachedTranslation>;
  linkTranslations: Record<string, Record<string, string>>;
  coverImageUrl: string;
  isPro: boolean;
}

interface DashboardStore {
  // Page list (for header selector)
  pages: DashboardPage[];
  selectedPageId: string | null;
  setPages: (pages: DashboardPage[]) => void;
  selectPage: (pageId: string) => void;
  getSelectedPage: () => DashboardPage | null;

  // Full page edit cache — keyed by pageId
  pageCache: Record<string, CachedPageData>;
  setCachedPage: (pageId: string, data: CachedPageData) => void;
  getCachedPage: (pageId: string) => CachedPageData | null;
  invalidatePage: (pageId: string) => void;
}

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set, get) => ({
      pages: [],
      selectedPageId: null,
      pageCache: {},

      setPages: (pages) => {
        const current = get().selectedPageId;
        const stillExists = pages.some((p) => p.id === current);
        set({
          pages,
          selectedPageId: stillExists ? current : (pages[0]?.id ?? null),
        });
      },

      selectPage: (pageId) => set({ selectedPageId: pageId }),

      getSelectedPage: () => {
        const { pages, selectedPageId } = get();
        return pages.find((p) => p.id === selectedPageId) ?? pages[0] ?? null;
      },

      setCachedPage: (pageId, data) =>
        set((state) => ({ pageCache: { ...state.pageCache, [pageId]: data } })),

      getCachedPage: (pageId) => get().pageCache[pageId] ?? null,

      invalidatePage: (pageId) =>
        set((state) => {
          const next = { ...state.pageCache };
          delete next[pageId];
          return { pageCache: next };
        }),
    }),
    {
      name: 'heybio-dashboard',
      version: 3,
      migrate: () => ({ pages: [], selectedPageId: null, pageCache: {} }),
    }
  )
);
