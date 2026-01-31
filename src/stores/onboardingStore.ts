/**
 * Onboarding Store
 * Persists to localStorage until user signs up
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OnboardingDraft, Link, SocialIcon } from '@/types';

interface OnboardingState {
  draft: OnboardingDraft | null;
  currentStep: number;
  
  // Actions
  setSlug: (slug: string) => void;
  setDisplayName: (name: string) => void;
  setBio: (bio: string) => void;
  setAvatarUrl: (url: string) => void;
  setThemeId: (themeId: string) => void;
  addLink: (link: Omit<Link, 'id' | 'page_id' | 'created_at'>) => void;
  updateLink: (index: number, link: Partial<Omit<Link, 'id' | 'page_id' | 'created_at'>>) => void;
  removeLink: (index: number) => void;
  reorderLinks: (fromIndex: number, toIndex: number) => void;
  addSocialIcon: (icon: Omit<SocialIcon, 'id' | 'page_id'>) => void;
  removeSocialIcon: (index: number) => void;
  setStep: (step: number) => void;
  reset: () => void;
  initDraft: (slug: string) => void;
}

const initialDraft: OnboardingDraft = {
  slug: '',
  display_name: '',
  bio: '',
  avatar_url: '',
  theme_id: 'clean',
  links: [],
  social_icons: [],
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      draft: null,
      currentStep: 1,

      initDraft: (slug: string) => {
        set({
          draft: { ...initialDraft, slug, display_name: slug },
          currentStep: 1,
        });
      },

      setSlug: (slug: string) => {
        const draft = get().draft;
        if (draft) {
          set({ draft: { ...draft, slug } });
        }
      },

      setDisplayName: (display_name: string) => {
        const draft = get().draft;
        if (draft) {
          set({ draft: { ...draft, display_name } });
        }
      },

      setBio: (bio: string) => {
        const draft = get().draft;
        if (draft) {
          set({ draft: { ...draft, bio } });
        }
      },

      setAvatarUrl: (avatar_url: string) => {
        const draft = get().draft;
        if (draft) {
          set({ draft: { ...draft, avatar_url } });
        }
      },

      setThemeId: (theme_id: string) => {
        const draft = get().draft;
        if (draft) {
          set({ draft: { ...draft, theme_id } });
        }
      },

      addLink: (link) => {
        const draft = get().draft;
        if (draft) {
          const newLink = { ...link, order: draft.links.length };
          set({ draft: { ...draft, links: [...draft.links, newLink] } });
        }
      },

      updateLink: (index, updates) => {
        const draft = get().draft;
        if (draft) {
          const links = [...draft.links];
          links[index] = { ...links[index], ...updates };
          set({ draft: { ...draft, links } });
        }
      },

      removeLink: (index) => {
        const draft = get().draft;
        if (draft) {
          const links = draft.links.filter((_, i) => i !== index);
          // Reorder remaining links
          links.forEach((link, i) => (link.order = i));
          set({ draft: { ...draft, links } });
        }
      },

      reorderLinks: (fromIndex, toIndex) => {
        const draft = get().draft;
        if (draft) {
          const links = [...draft.links];
          const [removed] = links.splice(fromIndex, 1);
          links.splice(toIndex, 0, removed);
          // Update order
          links.forEach((link, i) => (link.order = i));
          set({ draft: { ...draft, links } });
        }
      },

      addSocialIcon: (icon) => {
        const draft = get().draft;
        if (draft) {
          const newIcon = { ...icon, order: draft.social_icons.length };
          set({ draft: { ...draft, social_icons: [...draft.social_icons, newIcon] } });
        }
      },

      removeSocialIcon: (index) => {
        const draft = get().draft;
        if (draft) {
          const social_icons = draft.social_icons.filter((_, i) => i !== index);
          social_icons.forEach((icon, i) => (icon.order = i));
          set({ draft: { ...draft, social_icons } });
        }
      },

      setStep: (currentStep: number) => set({ currentStep }),

      reset: () => set({ draft: null, currentStep: 1 }),
    }),
    {
      name: 'heybio-onboarding',
    }
  )
);
