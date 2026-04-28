'use client';

import { useState, useEffect, useCallback } from 'react';
import NextLink from 'next/link';
import { toast } from 'sonner';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/Skeleton';
import { ConfirmSheet } from '@/components/ui/confirm-sheet';
import { BioPage } from '@/components/bio-page';
import { getTheme } from '@/config/themes';
import { createClient } from '@/lib/supabase/client';
import { useDashboardStore } from '@/stores/dashboardStore';
import type { CachedTranslation } from '@/stores/dashboardStore';
import { logService } from '@/services/logService';
import { analyticsService } from '@/services/analyticsService';
import { SUPPORTED_LANGUAGES } from '@/lib/languages';
import { cn } from '@/lib/utils';
import type { SocialIcon as SocialIconType, PageTranslation } from '@/types';
import { TrialStartSheet } from '@/components/dashboard/TrialStartSheet';

interface EditLink {
  id?: string;
  title: string;
  url: string;
  order: number;
  is_active: boolean;
  is_nsfw: boolean;
  expires_at?: string | null;
  coming_soon_message?: string | null;
}

interface EditSocialIcon {
  platform: string;
  url: string;
  order: number;
  coming_soon_message?: string | null;
}

const FREE_THEMES = ['clean', 'soft', 'bold', 'dark', 'warm', 'minimal'];
const PRO_THEMES  = ['gradient', 'ocean', 'sunset', 'forest', 'midnight', 'cream', 'superstar'];

const SOCIAL_PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: 'instagram' },
  { id: 'twitter',   name: 'X',         icon: 'x-social'  },
  { id: 'youtube',   name: 'YouTube',   icon: 'youtube'   },
  { id: 'tiktok',    name: 'TikTok',    icon: 'tiktok'    },
  { id: 'spotify',   name: 'Spotify',   icon: 'spotify'   },
  { id: 'github',    name: 'GitHub',    icon: 'github'    },
  { id: 'linkedin',  name: 'LinkedIn',  icon: 'linkedin'  },
  { id: 'discord',   name: 'Discord',   icon: 'discord'   },
  { id: 'twitch',    name: 'Twitch',    icon: 'twitch'    },
  { id: 'email',     name: 'Email',     icon: 'mail'      },
  { id: 'website',   name: 'Website',   icon: 'globe'     },
];

type Tab = 'links' | 'social' | 'design' | 'languages';

// ── Theme card ──────────────────────────────────────────────────────────────

function ThemeCard({
  theme,
  selected,
  isPro: isProTheme,
  userIsPro,
  onSelect,
}: {
  theme: string;
  selected: boolean;
  isPro?: boolean;
  userIsPro?: boolean;
  onSelect: () => void;
}) {
  const themeData = getTheme(theme);
  return (
    <button
      onClick={onSelect}
      className={cn(
        'rounded-2xl p-3 text-left transition-all relative border-2',
        selected ? 'border-top' : 'border-transparent hover:border-low',
      )}
      style={{ background: themeData.colors.background }}
    >
      <div className="w-6 h-6 rounded-full mb-2" style={{ background: themeData.colors.primary }} />
      <span className="text-xs font-semibold capitalize" style={{ color: themeData.colors.text }}>
        {themeData.name}
      </span>
      {isProTheme && !userIsPro && (
        <div className="absolute top-1.5 right-1.5 text-[9px] font-bold bg-pink text-top px-1.5 py-0.5 rounded-full leading-none">
          PRO
        </div>
      )}
    </button>
  );
}

// ── Main page ───────────────────────────────────────────────────────────────

export default function EditPage() {
  const { getSelectedPage, setPages, pages, getCachedPage, setCachedPage } = useDashboardStore();
  const selectedPage = getSelectedPage();

  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [pageId,   setPageId]   = useState<string | null>(null);
  const [slug,     setSlug]     = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio,      setBio]      = useState('');
  const [themeId,  setThemeId]  = useState('clean');
  const [links,    setLinks]    = useState<EditLink[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('links');
  const [socialIcons, setSocialIcons] = useState<EditSocialIcon[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [uploadingCover, setUploadingCover] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [showTrialSheet, setShowTrialSheet] = useState(false);
  const [trialContext, setTrialContext] = useState<'theme' | 'cover'>('theme');
  const [pageLanguages, setPageLanguages] = useState<string[]>(['en']);
  const [activeLang, setActiveLang] = useState('en');
  const [translations, setTranslations] = useState<Record<string, PageTranslation>>({});
  const [linkTranslations, setLinkTranslations] = useState<Record<string, Record<string, string>>>({});

  const loadPage = useCallback(async (targetPageId?: string) => {
    if (targetPageId) {
      const cached = getCachedPage(targetPageId);
      if (cached) {
        setPageId(targetPageId);
        setSlug(cached.slug);
        setDisplayName(cached.displayName);
        setBio(cached.bio);
        setThemeId(cached.themeId);
        setAvatarUrl(cached.avatarUrl);
        setCoverImageUrl(cached.coverImageUrl ?? '');
        setPageLanguages(cached.languages);
        setLinks(cached.links.map((l) => ({ ...l, is_nsfw: l.is_nsfw ?? false })));
        setSocialIcons(cached.socialIcons);
        const restoredTrans: Record<string, PageTranslation> = {};
        Object.entries(cached.translations).forEach(([code, t]) => {
          restoredTrans[code] = {
            id: t.id ?? '',
            page_id: targetPageId,
            language_code: t.language_code,
            display_name: t.display_name,
            bio: t.bio,
            created_at: '',
            updated_at: '',
          };
        });
        setTranslations(restoredTrans);
        setLinkTranslations(cached.linkTranslations);
        setIsPro(cached.isPro);
        setLoading(false);

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single();
          const freshPro = profile?.plan === 'pro';
          if (freshPro !== cached.isPro) {
            setIsPro(freshPro);
            setCachedPage(targetPageId, { ...cached, isPro: freshPro });
          }
        }
        return;
      }
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single();
      const proStatus = profile?.plan === 'pro';
      setIsPro(proStatus);

      const baseQuery = supabase.from('pages').select('*').eq('user_id', user.id);
      let page = targetPageId ? (await baseQuery.eq('id', targetPageId)).data?.[0] : null;
      if (!page) page = (await baseQuery.order('created_at', { ascending: false })).data?.[0] ?? null;
      if (!page) { setLoading(false); return; }

      setPageId(page.id);
      setSlug(page.slug);
      setDisplayName(page.display_name);
      setBio(page.bio ?? '');
      setThemeId(page.theme_id);
      setAvatarUrl(page.avatar_url ?? '');
      setCoverImageUrl(page.cover_image_url ?? '');
      setPageLanguages(page.languages ?? ['en']);

      const { data: pageLinks } = await supabase.from('links').select('*').eq('page_id', page.id).order('order');
      const mappedLinks: EditLink[] = (pageLinks ?? []).map((l) => ({
        id: l.id,
        title: l.title,
        url: l.url,
        order: l.order,
        is_active: l.is_active ?? true,
        is_nsfw: l.is_nsfw ?? false,
        expires_at: l.expires_at ?? null,
        coming_soon_message: l.coming_soon_message ?? null,
      }));
      setLinks(mappedLinks);

      const mappedSocial: EditSocialIcon[] = ((page.social_icons ?? []) as EditSocialIcon[]).sort((a, b) => a.order - b.order);
      setSocialIcons(mappedSocial);

      const { data: pageTrans } = await supabase.from('page_translations').select('*').eq('page_id', page.id);
      const transMap: Record<string, PageTranslation> = {};
      (pageTrans ?? []).forEach((t) => { transMap[t.language_code] = t; });
      setTranslations(transMap);

      const ltMap: Record<string, Record<string, string>> = {};
      if (pageLinks?.length) {
        const { data: linkTrans } = await supabase.from('link_translations').select('*').in('link_id', pageLinks.map((l) => l.id));
        (linkTrans ?? []).forEach((t) => {
          if (!ltMap[t.link_id]) ltMap[t.link_id] = {};
          if (t.title) ltMap[t.link_id][t.language_code] = t.title;
        });
      }
      setLinkTranslations(ltMap);

      const cachedTransMap: Record<string, CachedTranslation> = {};
      Object.entries(transMap).forEach(([code, t]) => {
        cachedTransMap[code] = { id: t.id, language_code: t.language_code, display_name: t.display_name, bio: t.bio };
      });
      setCachedPage(page.id, {
        slug: page.slug, displayName: page.display_name, bio: page.bio ?? '',
        themeId: page.theme_id, avatarUrl: page.avatar_url ?? '', coverImageUrl: page.cover_image_url ?? '',
        languages: page.languages ?? ['en'], links: mappedLinks, socialIcons: mappedSocial,
        translations: cachedTransMap, linkTranslations: ltMap, isPro: proStatus,
      });
    } catch (err) {
      logService.error('edit_page_load_error', { error: err });
      toast.error('Could not load your page');
    } finally {
      setLoading(false);
    }
  }, [getCachedPage, setCachedPage]);

  useEffect(() => { loadPage(selectedPage?.id); }, [selectedPage?.id, loadPage]);

  const handleSave = async () => {
    if (!pageId) return;

    // Gate pro features before saving
    if (!isPro && PRO_THEMES.includes(themeId)) {
      setTrialContext('theme');
      setShowTrialSheet(true);
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const { error: pageError } = await supabase.from('pages').update({
      display_name: displayName,
      bio,
      theme_id: themeId,
      languages: pageLanguages,
      social_icons: socialIcons.map((s, i) => ({ platform: s.platform, url: s.url, order: i, coming_soon_message: s.coming_soon_message ?? null })),
      cover_image_url: coverImageUrl || null,
    }).eq('id', pageId);

    if (pageError) {
      logService.error('edit_save_page_error', { error: pageError });
      toast.error('Could not save. Try again.');
      setSaving(false);
      return;
    }

    const updatedLinks = [...links];
    for (let i = 0; i < updatedLinks.length; i++) {
      const link = updatedLinks[i];
      if (link.id) {
        await supabase.from('links').update({
          title: link.title, url: link.url, order: link.order,
          is_active: link.is_active, is_nsfw: link.is_nsfw,
          expires_at: link.expires_at ?? null, coming_soon_message: link.coming_soon_message ?? null,
        }).eq('id', link.id);
      } else {
        const { data } = await supabase.from('links').insert({
          page_id: pageId, title: link.title, url: link.url, order: link.order,
          is_active: link.is_active, is_nsfw: link.is_nsfw,
          expires_at: link.expires_at ?? null, coming_soon_message: link.coming_soon_message ?? null,
        }).select().single();
        if (data) updatedLinks[i] = { ...link, id: data.id };
      }
    }
    setLinks(updatedLinks);

    for (const langCode of pageLanguages.filter((l) => l !== 'en')) {
      const trans = translations[langCode];
      if (trans?.id) {
        await supabase.from('page_translations').update({ display_name: trans.display_name, bio: trans.bio }).eq('id', trans.id);
      } else if (trans) {
        const { data } = await supabase.from('page_translations').insert({ page_id: pageId, language_code: langCode, display_name: trans.display_name, bio: trans.bio }).select().single();
        if (data) setTranslations((prev) => ({ ...prev, [langCode]: data }));
      }
    }

    for (const link of updatedLinks) {
      if (!link.id) continue;
      for (const langCode of pageLanguages.filter((l) => l !== 'en')) {
        const title = linkTranslations[link.id]?.[langCode];
        if (!title) continue;
        await supabase.from('link_translations').upsert({ link_id: link.id, language_code: langCode, title }, { onConflict: 'link_id,language_code' });
      }
    }

    const savedCachedTrans: Record<string, CachedTranslation> = {};
    Object.entries(translations).forEach(([code, t]) => {
      savedCachedTrans[code] = { id: t.id, language_code: t.language_code, display_name: t.display_name, bio: t.bio };
    });
    setCachedPage(pageId, { slug, displayName, bio, themeId, avatarUrl, coverImageUrl, languages: pageLanguages, links: updatedLinks, socialIcons, translations: savedCachedTrans, linkTranslations, isPro });

    if (slug) {
      fetch('/api/revalidate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug }) }).catch(() => {});
    }

    analyticsService.track('page_updated', { page_id: pageId });
    toast.success('Saved!');
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!pageId) return;
    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase.from('pages').delete().eq('id', pageId);
    if (error) { toast.error('Could not delete. Try again.'); setDeleting(false); return; }
    setPages(pages.filter((p) => p.id !== pageId));
    window.location.href = '/dashboard';
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pageId) return;
    setUploadingAvatar(true);
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const { error } = await supabase.storage.from('avatars').upload(`${pageId}/avatar.${fileExt}`, file, { upsert: true });
    if (error) { toast.error('Upload failed'); setUploadingAvatar(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(`${pageId}/avatar.${fileExt}`);
    setAvatarUrl(publicUrl);
    await supabase.from('pages').update({ avatar_url: publicUrl }).eq('id', pageId);
    toast.success('Photo updated!');
    setUploadingAvatar(false);
  };

  const handleRemoveAvatar = async () => {
    if (!pageId) return;
    setAvatarUrl('');
    const supabase = createClient();
    await supabase.from('pages').update({ avatar_url: null }).eq('id', pageId);
    toast.success('Photo removed');
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pageId) return;
    setUploadingCover(true);
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const { error } = await supabase.storage.from('avatars').upload(`${pageId}/cover.${fileExt}`, file, { upsert: true });
    if (error) { toast.error('Upload failed'); setUploadingCover(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(`${pageId}/cover.${fileExt}`);
    setCoverImageUrl(publicUrl);
    toast.success('Cover updated!');
    setUploadingCover(false);
  };

  const handleRemoveCover = async () => {
    if (!pageId) return;
    setCoverImageUrl('');
    const supabase = createClient();
    for (const ext of ['jpg', 'jpeg', 'png', 'webp', 'gif']) {
      await supabase.storage.from('avatars').remove([`${pageId}/cover.${ext}`]);
    }
    toast.success('Cover removed');
  };

  // link helpers
  const addLink = () => setLinks([...links, { title: '', url: '', order: links.length, is_active: true, is_nsfw: false }]);
  const updateLink = (i: number, u: Partial<EditLink>) => { const n = [...links]; n[i] = { ...n[i], ...u }; setLinks(n); };
  const removeLink = async (i: number) => {
    const link = links[i];
    if (link.id) { const supabase = createClient(); await supabase.from('links').delete().eq('id', link.id); }
    setLinks(links.filter((_, idx) => idx !== i));
  };
  const moveLink = (i: number, dir: -1 | 1) => {
    const ni = i + dir;
    if (ni < 0 || ni >= links.length) return;
    const n = [...links]; [n[i], n[ni]] = [n[ni], n[i]]; n.forEach((l, idx) => (l.order = idx)); setLinks(n);
  };

  // social helpers
  const addSocialIcon = (platform: string) => setSocialIcons([...socialIcons, { platform, url: '', order: socialIcons.length }]);
  const updateSocialIcon = (i: number, u: Partial<EditSocialIcon>) => { const n = [...socialIcons]; n[i] = { ...n[i], ...u }; setSocialIcons(n); };
  const removeSocialIcon = (i: number) => setSocialIcons(socialIcons.filter((_, idx) => idx !== i));
  const moveSocialIcon = (i: number, dir: -1 | 1) => {
    const ni = i + dir;
    if (ni < 0 || ni >= socialIcons.length) return;
    const n = [...socialIcons]; [n[i], n[ni]] = [n[ni], n[i]]; n.forEach((s, idx) => (s.order = idx)); setSocialIcons(n);
  };

  // language helpers
  const addLanguage = (code: string) => { if (pageLanguages.includes(code)) return; setPageLanguages([...pageLanguages, code]); setActiveLang(code); };
  const removeLanguage = async (code: string) => {
    if (code === 'en') return;
    if (pageId) { const supabase = createClient(); await supabase.from('page_translations').delete().eq('page_id', pageId).eq('language_code', code); }
    setPageLanguages(pageLanguages.filter((l) => l !== code));
    setTranslations((prev) => { const n = { ...prev }; delete n[code]; return n; });
    if (activeLang === code) setActiveLang('en');
  };
  const updateTranslation = (langCode: string, field: 'display_name' | 'bio', value: string) => {
    setTranslations((prev) => ({ ...prev, [langCode]: { ...(prev[langCode] ?? { id: '', page_id: pageId ?? '', language_code: langCode, created_at: '', updated_at: '' }), [field]: value } }));
  };
  const updateLinkTranslation = (linkId: string, langCode: string, title: string) => {
    setLinkTranslations((prev) => ({ ...prev, [linkId]: { ...(prev[linkId] ?? {}), [langCode]: title } }));
  };

  const now = new Date().toISOString();
  const previewLinks = links.filter((l) => l.is_active && l.title && l.url && (!l.expires_at || l.expires_at > now)).map((l, i) => ({ ...l, order: i }));
  const previewSocialIcons = socialIcons.filter((s) => s.url).map((s, i) => ({ ...s, order: i })) as SocialIconType[];
  const previewPage = { display_name: displayName || 'Your Name', bio: bio || '', avatar_url: avatarUrl, theme_id: themeId, slug: slug || 'preview', languages: pageLanguages };

  const TABS: { id: Tab; label: string }[] = [
    { id: 'links',     label: `Links${links.length ? ` (${links.length})` : ''}` },
    { id: 'social',    label: `Social${socialIcons.length ? ` (${socialIcons.length})` : ''}` },
    { id: 'design',    label: 'Design'    },
    { id: 'languages', label: 'Languages' },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-20 rounded-3xl" />
        <Skeleton className="h-10 rounded-full" />
        <div className="space-y-3">
          <Skeleton className="h-20 rounded-3xl" />
          <Skeleton className="h-20 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!pageId) {
    return (
      <div className="text-center py-16">
        <p className="text-high mb-4">No page found.</p>
        <Button asChild><NextLink href="/new">Create a page</NextLink></Button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-top">Edit page</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="text-sm text-mid hover:text-orange transition-colors"
          >
            Delete
          </button>
          {/* Desktop save button */}
          <Button
            onClick={handleSave}
            loading={saving}
            variant="success"
            size="sm"
            className="hidden md:flex"
          >
            Save
          </Button>
        </div>
      </div>

      {/* Profile section */}
      <div className="bg-bottom border border-low rounded-3xl p-4 flex items-center gap-4">
        <label className="relative shrink-0 cursor-pointer group" aria-label="Change photo">
          <div className="w-14 h-14 rounded-full bg-low overflow-hidden flex items-center justify-center">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-high">
                {displayName.charAt(0).toUpperCase() || '?'}
              </span>
            )}
          </div>
          <div className="absolute inset-0 rounded-full bg-top/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {uploadingAvatar
              ? <Icon icon="loader-2" className="w-5 h-5 animate-spin text-bottom" />
              : <Icon icon="upload" className="w-5 h-5 text-bottom" />
            }
          </div>
          <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={uploadingAvatar} />
        </label>
        <div className="flex-1 min-w-0 space-y-2">
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
            className="h-10 text-sm font-semibold"
          />
          <Input
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Short bio"
            className="h-10 text-sm"
          />
        </div>
      </div>

      {/* Tab strip */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors',
              activeTab === tab.id ? 'bg-top text-bottom' : 'bg-low/50 text-high hover:bg-low'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content + preview */}
      <div className="grid lg:grid-cols-2 gap-5 items-start">

        {/* ── Editor ─────────────────────────────────── */}
        <div className="space-y-3">

          {/* LINKS TAB */}
          {activeTab === 'links' && (
            <>
              {links.map((link, i) => {
                const isExpired = link.expires_at ? new Date(link.expires_at) < new Date() : false;
                return (
                  <div key={i} className={cn('bg-bottom border border-low rounded-2xl p-3', isExpired && 'opacity-60')}>
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex gap-0.5">
                        <button onClick={() => moveLink(i, -1)} disabled={i === 0} className="w-7 h-7 flex items-center justify-center rounded-lg text-mid disabled:opacity-30 hover:bg-low transition-colors">
                          <Icon icon="arrow-up" className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => moveLink(i, 1)} disabled={i === links.length - 1} className="w-7 h-7 flex items-center justify-center rounded-lg text-mid disabled:opacity-30 hover:bg-low transition-colors">
                          <Icon icon="arrow-down" className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex-1" />
                      <button
                        onClick={() => updateLink(i, { is_active: !link.is_active })}
                        className={cn('w-7 h-7 flex items-center justify-center rounded-lg transition-colors', link.is_active ? 'text-green' : 'text-mid')}
                      >
                        <Icon icon={link.is_active ? 'eye' : 'eye-off'} className="w-4 h-4" />
                      </button>
                      <button onClick={() => removeLink(i)} className="w-7 h-7 flex items-center justify-center rounded-lg text-mid hover:text-orange transition-colors">
                        <Icon icon="trash-2" className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <Input value={link.title} onChange={(e) => updateLink(i, { title: e.target.value })} placeholder="Link title" className="h-10 text-sm" />
                      <Input value={link.url} onChange={(e) => updateLink(i, { url: e.target.value })} placeholder="https://..." className="h-10 text-sm" />
                    </div>

                    {/* Options row */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <button
                        onClick={() => updateLink(i, { is_nsfw: !link.is_nsfw })}
                        className={cn('text-xs px-2 py-1 rounded-lg border transition-colors', link.is_nsfw ? 'bg-orange/10 border-orange text-orange' : 'border-low text-mid hover:border-mid')}
                      >
                        18+
                      </button>
                      <button
                        onClick={() => updateLink(i, { coming_soon_message: link.coming_soon_message != null ? null : '' })}
                        className={cn('text-xs px-2 py-1 rounded-lg border transition-colors', link.coming_soon_message != null ? 'bg-blue/10 border-blue text-blue-600' : 'border-low text-mid hover:border-mid')}
                      >
                        Coming soon
                      </button>
                      <button
                        onClick={() => updateLink(i, { expires_at: link.expires_at ? null : new Date(Date.now() + 7 * 86400000).toISOString() })}
                        className={cn('text-xs px-2 py-1 rounded-lg border transition-colors', link.expires_at ? (isExpired ? 'bg-orange/10 border-orange text-orange' : 'bg-yellow/20 border-yellow text-yellow-700') : 'border-low text-mid hover:border-mid')}
                      >
                        {link.expires_at ? (isExpired ? 'Expired' : `Expires ${new Date(link.expires_at).toLocaleDateString('en', { month: 'short', day: 'numeric' })}`) : 'Temp'}
                      </button>
                    </div>

                    {link.coming_soon_message != null && (
                      <textarea
                        value={link.coming_soon_message}
                        onChange={(e) => updateLink(i, { coming_soon_message: e.target.value })}
                        placeholder="Coming soon message…"
                        rows={2}
                        className="w-full mt-2 rounded-xl bg-low border-0 px-3 py-2 text-sm text-top resize-none outline-none focus:ring-2 focus:ring-top/20"
                      />
                    )}
                    {link.expires_at && (
                      <input
                        type="datetime-local"
                        value={new Date(link.expires_at).toISOString().slice(0, 16)}
                        onChange={(e) => updateLink(i, { expires_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
                        className="w-full mt-2 rounded-xl bg-low border-0 px-3 py-2 text-sm text-top outline-none"
                      />
                    )}
                  </div>
                );
              })}

              <button
                onClick={addLink}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-low text-mid hover:border-top hover:text-top transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <Icon icon="plus" className="w-4 h-4" />
                Add link
              </button>
            </>
          )}

          {/* SOCIAL TAB */}
          {activeTab === 'social' && (
            <>
              {socialIcons.map((social, i) => (
                <div key={i} className="bg-bottom border border-low rounded-2xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon icon={social.platform} className="w-4 h-4 text-high" />
                    <span className="text-sm text-high capitalize flex-1">{social.platform}</span>
                    <button onClick={() => moveSocialIcon(i, -1)} disabled={i === 0} className="w-7 h-7 flex items-center justify-center rounded-lg text-mid disabled:opacity-30 hover:bg-low">
                      <Icon icon="arrow-up" className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => moveSocialIcon(i, 1)} disabled={i === socialIcons.length - 1} className="w-7 h-7 flex items-center justify-center rounded-lg text-mid disabled:opacity-30 hover:bg-low">
                      <Icon icon="arrow-down" className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => removeSocialIcon(i)} className="w-7 h-7 flex items-center justify-center rounded-lg text-mid hover:text-orange">
                      <Icon icon="trash-2" className="w-4 h-4" />
                    </button>
                  </div>
                  <Input
                    value={social.url}
                    onChange={(e) => updateSocialIcon(i, { url: e.target.value })}
                    placeholder={social.platform === 'email' ? 'mailto:you@example.com' : 'https://...'}
                    className="h-10 text-sm"
                  />
                </div>
              ))}

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {SOCIAL_PLATFORMS.filter((p) => !socialIcons.some((s) => s.platform === p.id)).map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => addSocialIcon(platform.id)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-low hover:border-top hover:bg-low/30 transition-colors"
                  >
                    <Icon icon={platform.icon} className="w-5 h-5 text-high" />
                    <span className="text-xs text-high">{platform.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* DESIGN TAB */}
          {activeTab === 'design' && (
            <div className="space-y-5">

              {/* Cover image — only shown for themes with a custom layout */}
              {getTheme(themeId).layout && getTheme(themeId).layout !== 'standard' && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-semibold text-top">Cover photo</span>
                    <span className="text-xs text-mid">Required for Superstar</span>
                  </div>
                  <div className="space-y-2">
                    {coverImageUrl && (
                      <div className="relative rounded-2xl overflow-hidden">
                        <img src={coverImageUrl} alt="Cover" className="w-full h-28 object-cover" />
                        <button onClick={handleRemoveCover} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80">
                          <Icon icon="x" className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                    <label className={cn('flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-low cursor-pointer hover:border-top transition-colors text-sm text-high', uploadingCover && 'opacity-50 pointer-events-none')}>
                      {uploadingCover ? <Icon icon="loader-2" className="w-4 h-4 animate-spin" /> : <Icon icon="image" className="w-4 h-4" />}
                      {coverImageUrl ? 'Change cover photo' : 'Upload cover photo'}
                      <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" disabled={uploadingCover} />
                    </label>
                  </div>
                </div>
              )}

              {/* Free themes */}
              <div>
                <p className="text-sm font-semibold text-top mb-2">Free themes</p>
                <div className="grid grid-cols-3 gap-2">
                  {FREE_THEMES.map((t) => (
                    <ThemeCard key={t} theme={t} selected={themeId === t} onSelect={() => setThemeId(t)} />
                  ))}
                </div>
              </div>

              {/* Pro themes */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm font-semibold text-top">Pro themes</p>
                  {!isPro && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-pink text-top font-bold">
                      Try free 30 days
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {PRO_THEMES.map((t) => (
                    <ThemeCard
                      key={t}
                      theme={t}
                      selected={themeId === t}
                      isPro
                      userIsPro={isPro}
                      onSelect={() => setThemeId(t)}
                    />
                  ))}
                </div>
                {!isPro && (
                  <p className="text-xs text-mid mt-2">Select a theme — you'll be prompted to start your trial when saving.</p>
                )}
              </div>
            </div>
          )}

          {/* LANGUAGES TAB */}
          {activeTab === 'languages' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {pageLanguages.map((code) => {
                  const lang = SUPPORTED_LANGUAGES.find((l) => l.code === code);
                  return (
                    <div
                      key={code}
                      onClick={() => setActiveLang(code)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-colors',
                        activeLang === code ? 'bg-top text-bottom' : 'bg-low text-high hover:bg-low/70'
                      )}
                    >
                      <span>{lang?.flag ?? '🌐'}</span>
                      <span>{lang?.nativeName ?? code.toUpperCase()}</span>
                      {code !== 'en' && (
                        <button onClick={(e) => { e.stopPropagation(); removeLanguage(code); }} className="ml-0.5 opacity-60 hover:opacity-100">
                          <Icon icon="x" className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {SUPPORTED_LANGUAGES.filter((l) => !pageLanguages.includes(l.code)).map((lang) => (
                  <button key={lang.code} onClick={() => addLanguage(lang.code)} className="flex items-center gap-2 p-2.5 rounded-2xl bg-low hover:bg-low/70 transition-colors text-sm">
                    <span>{lang.flag}</span>
                    <span className="text-high truncate">{lang.nativeName}</span>
                  </button>
                ))}
              </div>

              {activeLang !== 'en' && (
                <div className="space-y-3 pt-2">
                  <p className="text-sm font-semibold text-top">
                    {SUPPORTED_LANGUAGES.find((l) => l.code === activeLang)?.flag}{' '}
                    {SUPPORTED_LANGUAGES.find((l) => l.code === activeLang)?.name} translation
                  </p>
                  <div className="space-y-1.5">
                    <label className="text-xs text-mid font-medium">Name</label>
                    <Input value={translations[activeLang]?.display_name ?? ''} onChange={(e) => updateTranslation(activeLang, 'display_name', e.target.value)} placeholder={displayName} className="h-10 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-mid font-medium">Bio</label>
                    <Input value={translations[activeLang]?.bio ?? ''} onChange={(e) => updateTranslation(activeLang, 'bio', e.target.value)} placeholder={bio} className="h-10 text-sm" />
                  </div>
                  {links.filter((l) => l.title && l.url && l.id).map((link) => (
                    <div key={link.id} className="space-y-1.5">
                      <label className="text-xs text-mid font-medium">{link.title}</label>
                      <Input
                        value={linkTranslations[link.id!]?.[activeLang] ?? ''}
                        onChange={(e) => updateLinkTranslation(link.id!, activeLang, e.target.value)}
                        placeholder={link.title}
                        className="h-10 text-sm"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Live preview (desktop only) ─────────────── */}
        <div className="hidden lg:block lg:sticky lg:top-8">
          <p className="text-xs text-mid font-medium mb-2">Live preview</p>
          <div className="h-[560px] overflow-auto rounded-3xl border border-low">
            <BioPage
              page={previewPage}
              links={previewLinks}
              socialIcons={previewSocialIcons}
              coverImageUrl={coverImageUrl || undefined}
              isPro={isPro}
              showBadge
              isPreview
            />
          </div>
        </div>
      </div>

      {/* ── Floating save button (mobile) ──────────── */}
      <div className="fixed bottom-20 left-4 right-4 z-30 md:hidden" style={{ bottom: 'calc(64px + env(safe-area-inset-bottom) + 12px)' }}>
        <Button
          onClick={handleSave}
          loading={saving}
          variant="success"
          size="lg"
          className="w-full shadow-xl"
        >
          Save changes
        </Button>
      </div>

      <ConfirmSheet
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete this page?"
        description="This will permanently delete your bio page and all its data. This cannot be undone."
        confirmText="Delete page"
        cancelText="Keep it"
        loading={deleting}
      />

      <TrialStartSheet
        open={showTrialSheet}
        onClose={() => setShowTrialSheet(false)}
        context={trialContext}
        onUseFreeTheme={() => {
          if (trialContext === 'theme') setThemeId('clean');
          if (trialContext === 'cover') setCoverImageUrl('');
          setShowTrialSheet(false);
        }}
      />
    </div>
  );
}
