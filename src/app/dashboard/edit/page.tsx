'use client';

import { useState, useEffect, useCallback } from 'react';
import NextLink from 'next/link';
import { toast } from 'sonner';
import { Icon } from '@/components/ui/icon';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BioPage } from '@/components/bio-page';
import { getTheme } from '@/config/themes';
import { createClient } from '@/lib/supabase/client';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useDashboardStore } from '@/stores/dashboardStore';
import type { CachedTranslation } from '@/stores/dashboardStore';
import { logService } from '@/services/logService';
import { analyticsService } from '@/services/analyticsService';
import { SUPPORTED_LANGUAGES } from '@/lib/languages';
import { cn } from '@/lib/utils';
import type { SocialIcon as SocialIconType, PageTranslation, LinkTranslation } from '@/types';

interface EditLink {
  id?: string;
  title: string;
  url: string;
  order: number;
  is_active: boolean;
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
const PRO_THEMES = ['gradient', 'ocean', 'sunset', 'forest', 'midnight', 'cream'];

const SOCIAL_PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: 'instagram' },
  { id: 'twitter', name: 'Twitter', icon: 'twitter' },
  { id: 'youtube', name: 'YouTube', icon: 'youtube' },
  { id: 'tiktok', name: 'TikTok', icon: 'tiktok' },
  { id: 'spotify', name: 'Spotify', icon: 'spotify' },
  { id: 'github', name: 'GitHub', icon: 'github' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin' },
  { id: 'discord', name: 'Discord', icon: 'discord' },
  { id: 'twitch', name: 'Twitch', icon: 'twitch' },
  { id: 'email', name: 'Email', icon: 'mail' },
  { id: 'website', name: 'Website', icon: 'globe' },
];

export default function EditPage() {
  const { getSelectedPage, setPages, pages, getCachedPage, setCachedPage } = useDashboardStore();
  const selectedPage = getSelectedPage();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageId, setPageId] = useState<string | null>(null);
  const [slug, setSlug] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [themeId, setThemeId] = useState('clean');
  const [links, setLinks] = useState<EditLink[]>([]);
  const [activeTab, setActiveTab] = useState<'links' | 'social' | 'design' | 'languages'>('links');
  const [socialIcons, setSocialIcons] = useState<EditSocialIcon[]>([]);
  const [showSocialComingSoon, setShowSocialComingSoon] = useState<Record<number, boolean>>({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [isPro, setIsPro] = useState(false);

  // Language state
  const [pageLanguages, setPageLanguages] = useState<string[]>(['en']);
  const [activeLang, setActiveLang] = useState('en');
  const [translations, setTranslations] = useState<Record<string, PageTranslation>>({});
  const [linkTranslations, setLinkTranslations] = useState<Record<string, Record<string, string>>>({});
  // linkTranslations[linkId][languageCode] = translatedTitle


  const loadPage = useCallback(async (targetPageId?: string) => {
    // Cache hit: hydrate from store without any DB calls
    if (targetPageId) {
      const cached = getCachedPage(targetPageId);
      if (cached) {
        setPageId(targetPageId);
        setSlug(cached.slug);
        setDisplayName(cached.displayName);
        setBio(cached.bio);
        setThemeId(cached.themeId);
        setAvatarUrl(cached.avatarUrl);
        setPageLanguages(cached.languages);
        setLinks(cached.links);
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
        return;
      }
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Check plan
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single();
      const proStatus = profile?.plan === 'pro';
      setIsPro(proStatus);

      // Load the specific page — if the stored ID is stale, fall back to the first page
      const baseQuery = supabase.from('pages').select('*').eq('user_id', user.id);
      let page = targetPageId
        ? (await baseQuery.eq('id', targetPageId)).data?.[0]
        : null;

      // Fallback: load the most recent page if target wasn't found
      if (!page) {
        page = (await baseQuery.order('created_at', { ascending: false })).data?.[0] ?? null;
      }

      if (!page) {
        setLoading(false);
        return;
      }

      setPageId(page.id);
      setSlug(page.slug);
      setDisplayName(page.display_name);
      setBio(page.bio ?? '');
      setThemeId(page.theme_id);
      setAvatarUrl(page.avatar_url ?? '');
      setPageLanguages(page.languages ?? ['en']);

      // Load links
      const { data: pageLinks, error: linksError } = await supabase
        .from('links')
        .select('*')
        .eq('page_id', page.id)
        .order('order');

      if (linksError) {
        logService.error('edit_load_links_error', { error: linksError });
      }

      const mappedLinks: EditLink[] =
        pageLinks?.map((l) => ({
          id: l.id,
          title: l.title,
          url: l.url,
          order: l.order,
          is_active: l.is_active ?? true,
          expires_at: l.expires_at ?? null,
          coming_soon_message: l.coming_soon_message ?? null,
        })) ?? [];
      setLinks(mappedLinks);

      const mappedSocial: EditSocialIcon[] = (
        (page.social_icons ?? []) as EditSocialIcon[]
      ).sort((a, b) => a.order - b.order);
      setSocialIcons(mappedSocial);

      // Load page translations
      const { data: pageTrans } = await supabase
        .from('page_translations')
        .select('*')
        .eq('page_id', page.id);

      const transMap: Record<string, PageTranslation> = {};
      if (pageTrans) {
        pageTrans.forEach((t) => {
          transMap[t.language_code] = t;
        });
      }
      setTranslations(transMap);

      // Load link translations
      const ltMap: Record<string, Record<string, string>> = {};
      if (pageLinks && pageLinks.length > 0) {
        const linkIds = pageLinks.map((l) => l.id);
        const { data: linkTrans } = await supabase
          .from('link_translations')
          .select('*')
          .in('link_id', linkIds);

        if (linkTrans) {
          linkTrans.forEach((t) => {
            if (!ltMap[t.link_id]) ltMap[t.link_id] = {};
            if (t.title) ltMap[t.link_id][t.language_code] = t.title;
          });
        }
      }
      setLinkTranslations(ltMap);

      // Cache everything so future tab switches skip DB calls
      const cachedTransMap: Record<string, CachedTranslation> = {};
      Object.entries(transMap).forEach(([code, t]) => {
        cachedTransMap[code] = {
          id: t.id,
          language_code: t.language_code,
          display_name: t.display_name,
          bio: t.bio,
        };
      });
      setCachedPage(page.id, {
        slug: page.slug,
        displayName: page.display_name,
        bio: page.bio ?? '',
        themeId: page.theme_id,
        avatarUrl: page.avatar_url ?? '',
        languages: page.languages ?? ['en'],
        links: mappedLinks,
        socialIcons: mappedSocial,
        translations: cachedTransMap,
        linkTranslations: ltMap,
        isPro: proStatus,
      });
    } catch (err) {
      logService.error('edit_page_load_error', { error: err });
      toast.error('Failed to load page data');
    } finally {
      setLoading(false);
    }
  }, [getCachedPage, setCachedPage]);

  useEffect(() => {
    loadPage(selectedPage?.id);
  }, [selectedPage?.id, loadPage]);

  const handleSave = async () => {
    if (!pageId) return;
    setSaving(true);

    const supabase = createClient();

    const { error: pageError } = await supabase
      .from('pages')
      .update({
        display_name: displayName,
        bio,
        theme_id: themeId,
        languages: pageLanguages,
        social_icons: socialIcons.map((s, i) => ({ platform: s.platform, url: s.url, order: i, coming_soon_message: s.coming_soon_message ?? null })),
      })
      .eq('id', pageId);

    if (pageError) {
      logService.error('edit_save_page_error', { error: pageError });
      toast.error('Failed to save. Please try again.');
      setSaving(false);
      return;
    }

    // Save links
    const updatedLinks = [...links];
    for (let i = 0; i < updatedLinks.length; i++) {
      const link = updatedLinks[i];
      if (link.id) {
        const { error } = await supabase
          .from('links')
          .update({
            title: link.title,
            url: link.url,
            order: link.order,
            is_active: link.is_active,
            expires_at: link.expires_at ?? null,
            coming_soon_message: link.coming_soon_message ?? null,
          })
          .eq('id', link.id);
        if (error) logService.error('edit_save_link_error', { error, linkId: link.id });
      } else {
        const { data, error } = await supabase
          .from('links')
          .insert({
            page_id: pageId,
            title: link.title,
            url: link.url,
            order: link.order,
            is_active: link.is_active,
            expires_at: link.expires_at ?? null,
            coming_soon_message: link.coming_soon_message ?? null,
          })
          .select()
          .single();
        if (error) {
          logService.error('edit_insert_link_error', { error });
        } else if (data) {
          updatedLinks[i] = { ...link, id: data.id };
        }
      }
    }
    setLinks(updatedLinks);

    // Delete removed links (links in DB that are no longer in state)
    // Note: we track deletions by only saving current links

    // Save page translations
    for (const langCode of pageLanguages.filter((l) => l !== 'en')) {
      const trans = translations[langCode];
      if (trans?.id) {
        await supabase
          .from('page_translations')
          .update({ display_name: trans.display_name, bio: trans.bio })
          .eq('id', trans.id);
      } else if (trans) {
        const { data } = await supabase
          .from('page_translations')
          .insert({ page_id: pageId, language_code: langCode, display_name: trans.display_name, bio: trans.bio })
          .select()
          .single();
        if (data) {
          setTranslations((prev) => ({ ...prev, [langCode]: data }));
        }
      }
    }

    // Save link translations
    for (const link of updatedLinks) {
      if (!link.id) continue;
      const ltForLink = linkTranslations[link.id] ?? {};
      for (const langCode of pageLanguages.filter((l) => l !== 'en')) {
        const title = ltForLink[langCode];
        if (!title) continue;
        // Upsert
        await supabase.from('link_translations').upsert(
          { link_id: link.id, language_code: langCode, title },
          { onConflict: 'link_id,language_code' }
        );
      }
    }

    // Keep cache in sync with saved state
    const savedCachedTrans: Record<string, CachedTranslation> = {};
    Object.entries(translations).forEach(([code, t]) => {
      savedCachedTrans[code] = {
        id: t.id,
        language_code: t.language_code,
        display_name: t.display_name,
        bio: t.bio,
      };
    });
    setCachedPage(pageId, {
      slug,
      displayName,
      bio,
      themeId,
      avatarUrl,
      languages: pageLanguages,
      links: updatedLinks,
      socialIcons,
      translations: savedCachedTrans,
      linkTranslations,
      isPro,
    });

    analyticsService.track('page_updated', { page_id: pageId });
    toast.success('Changes saved!');
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!pageId) return;
    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase.from('pages').delete().eq('id', pageId);
    if (error) {
      toast.error('Failed to delete. Please try again.');
      setDeleting(false);
      return;
    }
    // Remove from store
    const remaining = pages.filter((p) => p.id !== pageId);
    setPages(remaining);
    window.location.href = '/dashboard';
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pageId) return;
    setUploadingAvatar(true);
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const filePath = `${pageId}/avatar.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });
    if (uploadError) {
      logService.error('avatar_upload_error', { error: uploadError });
      toast.error('Failed to upload image. Please try again.');
      setUploadingAvatar(false);
      return;
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(filePath);
    setAvatarUrl(publicUrl);
    await supabase.from('pages').update({ avatar_url: publicUrl }).eq('id', pageId);
    toast.success('Profile photo updated!');
    setUploadingAvatar(false);
  };

  const handleRemoveAvatar = async () => {
    if (!pageId) return;
    setAvatarUrl('');
    const supabase = createClient();
    await supabase.from('pages').update({ avatar_url: null }).eq('id', pageId);
    toast.success('Profile photo removed');
  };

  // Link helpers
  const addLink = () =>
    setLinks([...links, { title: '', url: '', order: links.length, is_active: true }]);

  const updateLink = (index: number, updates: Partial<EditLink>) => {
    const n = [...links];
    n[index] = { ...n[index], ...updates };
    setLinks(n);
  };

  const removeLink = async (index: number) => {
    const link = links[index];
    if (link.id) {
      const supabase = createClient();
      await supabase.from('links').delete().eq('id', link.id);
    }
    setLinks(links.filter((_, i) => i !== index));
  };

  const moveLink = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= links.length) return;
    const n = [...links];
    [n[index], n[newIndex]] = [n[newIndex], n[index]];
    n.forEach((l, i) => (l.order = i));
    setLinks(n);
  };

  // Social helpers
  const addSocialIcon = (platform: string) =>
    setSocialIcons([...socialIcons, { platform, url: '', order: socialIcons.length }]);

  const updateSocialIcon = (index: number, updates: Partial<EditSocialIcon>) => {
    const n = [...socialIcons];
    n[index] = { ...n[index], ...updates };
    setSocialIcons(n);
  };

  const removeSocialIcon = (index: number) => {
    setSocialIcons(socialIcons.filter((_, i) => i !== index));
  };

  const moveSocialIcon = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= socialIcons.length) return;
    const n = [...socialIcons];
    [n[index], n[newIndex]] = [n[newIndex], n[index]];
    n.forEach((s, i) => (s.order = i));
    setSocialIcons(n);
  };

  // Language helpers
  const addLanguage = (code: string) => {
    if (pageLanguages.includes(code)) return;
    setPageLanguages([...pageLanguages, code]);
    setActiveLang(code);
  };

  const removeLanguage = async (code: string) => {
    if (code === 'en') return;
    if (pageId) {
      const supabase = createClient();
      await supabase.from('page_translations').delete().eq('page_id', pageId).eq('language_code', code);
    }
    setPageLanguages(pageLanguages.filter((l) => l !== code));
    setTranslations((prev) => {
      const n = { ...prev };
      delete n[code];
      return n;
    });
    if (activeLang === code) setActiveLang('en');
  };

  const updateTranslation = (langCode: string, field: 'display_name' | 'bio', value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [langCode]: {
        ...(prev[langCode] ?? { id: '', page_id: pageId ?? '', language_code: langCode, created_at: '', updated_at: '' }),
        [field]: value,
      },
    }));
  };

  const updateLinkTranslation = (linkId: string, langCode: string, title: string) => {
    setLinkTranslations((prev) => ({
      ...prev,
      [linkId]: { ...(prev[linkId] ?? {}), [langCode]: title },
    }));
  };

  // Preview data
  const previewPage = {
    display_name: displayName || 'Your Name',
    bio: bio || '',
    avatar_url: avatarUrl,
    theme_id: themeId,
    slug: slug || 'preview',
    languages: pageLanguages,
  };

  const now = new Date().toISOString();
  const previewLinks = links
    .filter((l) => l.is_active && l.title && l.url && (!l.expires_at || l.expires_at > now))
    .map((link, index) => ({ ...link, order: index }));

  const previewSocialIcons = socialIcons.filter((s) => s.url).map((s, i) => ({
    ...s,
    order: i,
  })) as SocialIconType[];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Icon icon="loader-2" className="w-8 h-8 animate-spin text-mid" />
        </div>
      </DashboardLayout>
    );
  }

  if (!pageId) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-top mb-2">No page found</h2>
          <p className="text-high mb-4">Create a page first to start editing</p>
          <Button className="rounded-full bg-green text-top hover:bg-green/80" asChild>
            <NextLink href="/new">Create page</NextLink>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const allThemes = [...FREE_THEMES, ...(isPro ? PRO_THEMES : [])];

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-2xl font-bold text-top">Edit Page</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(true)}
              className="rounded-full text-orange border-orange hover:bg-orange/10"
            >
              <Icon icon="trash-2" className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="rounded-full bg-green text-top hover:bg-green/80"
            >
              {saving ? (
                <Icon icon="loader-2" className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Icon icon="save" className="w-4 h-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="rounded-4xl py-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-top flex items-center justify-center text-bottom font-bold text-xl">
                  {displayName.charAt(0).toUpperCase() || '?'}
                </div>
              )}
              {uploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center bg-top/50 rounded-full">
                  <Icon icon="loader-2" className="w-6 h-6 animate-spin text-bottom" />
                </div>
              )}
            </div>
            <div>
              <label className="text-sm text-high block mb-1">Profile Photo</label>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-low hover:bg-low/20 cursor-pointer transition-colors">
                <Icon icon="upload" className="w-4 h-4" />
                <span className="text-sm">{avatarUrl ? 'Change' : 'Upload'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploadingAvatar}
                />
              </label>
              {avatarUrl && (
                <button onClick={handleRemoveAvatar} className="ml-2 text-sm text-orange hover:underline">
                  Remove
                </button>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-high block mb-1">Display Name</label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="rounded-xl bg-bottom border-2 border-top"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-sm text-high block mb-1">Bio</label>
              <Input
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="rounded-xl bg-bottom border-2 border-top"
                placeholder="Short bio"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {(
            [
              { id: 'links', label: `Links (${links.length})` },
              { id: 'social', label: `Social (${socialIcons.length})` },
              { id: 'design', label: 'Design' },
              { id: 'languages', label: `Languages (${pageLanguages.length})` },
            ] as const
          ).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                activeTab === id ? 'bg-green text-top' : 'bg-bottom text-high hover:bg-low'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Left: Editor */}
          <div className="space-y-4">
            {/* LINKS TAB */}
            {activeTab === 'links' && (
              <div className="rounded-4xl py-4 space-y-3">
                {links.map((link, index) => {
                  const isExpired = link.expires_at ? new Date(link.expires_at) < new Date() : false;
                  const expiresLocal = link.expires_at
                    ? new Date(link.expires_at).toISOString().slice(0, 16)
                    : '';
                  return (
                    <div
                      key={index}
                      className={cn('rounded-3xl p-3 border-2 border-top', isExpired && 'opacity-60')}
                    >
                      {/* Controls row */}
                      <div className="flex items-center gap-1 mb-2">
                        <button
                          onClick={() => moveLink(index, -1)}
                          disabled={index === 0}
                          className="p-1 text-high disabled:opacity-30 hover:text-top"
                          title="Move up"
                        >
                          <Icon icon="arrow-up" className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveLink(index, 1)}
                          disabled={index === links.length - 1}
                          className="p-1 text-high disabled:opacity-30 hover:text-top"
                          title="Move down"
                        >
                          <Icon icon="arrow-down" className="w-4 h-4" />
                        </button>
                        <div className="flex-1" />
                        <button
                          onClick={() => updateLink(index, { is_active: !link.is_active })}
                          className={cn('p-1 rounded', link.is_active ? 'text-green' : 'text-high')}
                          title={link.is_active ? 'Hide' : 'Show'}
                        >
                          <Icon icon={link.is_active ? 'eye' : 'eye-off'} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeLink(index)}
                          className="p-1 text-high hover:text-orange"
                          title="Delete"
                        >
                          <Icon icon="trash-2" className="w-4 h-4" />
                        </button>
                      </div>

                      <Input
                        value={link.title}
                        onChange={(e) => updateLink(index, { title: e.target.value })}
                        placeholder="Link title"
                        className="rounded-xl bg-bottom border-0 mb-2"
                      />
                      <Input
                        value={link.url}
                        onChange={(e) => updateLink(index, { url: e.target.value })}
                        placeholder="https://..."
                        className="rounded-xl bg-bottom border-0"
                      />

                      {/* Options */}
                      <div className="mt-3 space-y-1">
                        {/* Coming soon */}
                        <button
                          type="button"
                          onClick={() =>
                            updateLink(index, {
                              coming_soon_message: link.coming_soon_message !== null && link.coming_soon_message !== undefined ? null : '',
                            })
                          }
                          className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-bottom text-sm transition-colors"
                        >
                          <div className={cn(
                            'w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                            link.coming_soon_message !== null && link.coming_soon_message !== undefined
                              ? 'bg-blue-500 border-blue-500'
                              : 'border-high'
                          )}>
                            {link.coming_soon_message !== null && link.coming_soon_message !== undefined && (
                              <Icon icon="check" className="w-2.5 h-2.5 text-white" />
                            )}
                          </div>
                          <span className="text-high">Coming soon</span>
                        </button>
                        {link.coming_soon_message !== null && link.coming_soon_message !== undefined && (
                          <div className="px-2 pb-1">
                            <textarea
                              value={link.coming_soon_message}
                              onChange={(e) => updateLink(index, { coming_soon_message: e.target.value })}
                              placeholder="e.g. We're working on it, stay tuned!"
                              rows={2}
                              className="w-full rounded-xl bg-bottom border-0 px-3 py-2 text-sm text-top resize-none"
                              autoFocus
                            />
                          </div>
                        )}

                        {/* Temporary / expiry */}
                        <button
                          type="button"
                          onClick={() => {
                            if (link.expires_at) {
                              updateLink(index, { expires_at: null });
                            } else {
                              const d = new Date();
                              d.setDate(d.getDate() + 7);
                              updateLink(index, { expires_at: d.toISOString() });
                            }
                          }}
                          className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-bottom text-sm transition-colors"
                        >
                          <div className={cn(
                            'w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                            link.expires_at ? 'bg-yellow-500 border-yellow-500' : 'border-high'
                          )}>
                            {link.expires_at && <Icon icon="check" className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <span className="text-high">Temporary link</span>
                          {link.expires_at && (
                            <span className={cn('ml-auto text-xs', isExpired ? 'text-orange' : 'text-high')}>
                              {isExpired ? 'Expired' : new Date(link.expires_at).toLocaleDateString('en', { dateStyle: 'medium' })}
                            </span>
                          )}
                        </button>
                        {link.expires_at && (
                          <div className="px-2 pb-1">
                            <input
                              type="datetime-local"
                              value={expiresLocal}
                              onChange={(e) =>
                                updateLink(index, {
                                  expires_at: e.target.value
                                    ? new Date(e.target.value).toISOString()
                                    : null,
                                })
                              }
                              className="w-full rounded-xl bg-bottom border-0 px-3 py-2 text-sm text-top"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                <Button
                  onClick={addLink}
                  variant="outline"
                  className="w-full rounded-full py-6 border-dashed"
                >
                  <Icon icon="plus" className="w-5 h-5 mr-2" />
                  Add Link
                </Button>
              </div>
            )}

            {/* SOCIAL TAB */}
            {activeTab === 'social' && (
              <div className="rounded-4xl py-4 space-y-3">
                <p className="text-sm text-high">Add your social media profiles</p>
                {socialIcons.map((social, index) => (
                  <div key={index} className="rounded-3xl p-3 border-2 border-top">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon icon={social.platform} className="w-5 h-5 text-high" />
                      <span className="text-sm text-high capitalize flex-1">{social.platform}</span>
                      <button
                        onClick={() => moveSocialIcon(index, -1)}
                        disabled={index === 0}
                        className="p-1 text-high disabled:opacity-30"
                      >
                        <Icon icon="arrow-up" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveSocialIcon(index, 1)}
                        disabled={index === socialIcons.length - 1}
                        className="p-1 text-high disabled:opacity-30"
                      >
                        <Icon icon="arrow-down" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowSocialComingSoon((prev) => ({ ...prev, [index]: !prev[index] }))}
                        className={cn('p-1 rounded', social.coming_soon_message ? 'text-blue-500' : 'text-high hover:text-top')}
                        title="Coming soon message"
                      >
                        <Icon icon="message-circle" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeSocialIcon(index)}
                        className="p-1 text-high hover:text-orange"
                      >
                        <Icon icon="trash-2" className="w-4 h-4" />
                      </button>
                    </div>
                    <Input
                      value={social.url}
                      onChange={(e) => updateSocialIcon(index, { url: e.target.value })}
                      placeholder={social.platform === 'email' ? 'mailto:you@example.com' : 'https://...'}
                      className="rounded-xl bg-bottom border-0"
                    />
                    {showSocialComingSoon[index] && (
                      <div className="mt-2 p-3 rounded-2xl bg-bottom space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-high font-medium">Coming Soon Message</span>
                          {social.coming_soon_message && (
                            <button
                              onClick={() => updateSocialIcon(index, { coming_soon_message: null })}
                              className="text-xs text-orange hover:underline"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <textarea
                          value={social.coming_soon_message ?? ''}
                          onChange={(e) => updateSocialIcon(index, { coming_soon_message: e.target.value || null })}
                          placeholder="e.g. Coming soon — stay tuned!"
                          rows={2}
                          className="w-full rounded-xl bg-low border-0 px-3 py-2 text-sm text-top resize-none"
                        />
                        <p className="text-xs text-high">Visitors will see this message instead of visiting the link.</p>
                      </div>
                    )}
                  </div>
                ))}

                <div className="grid grid-cols-3 gap-2">
                  {SOCIAL_PLATFORMS.filter((p) => !socialIcons.some((s) => s.platform === p.id)).map(
                    (platform) => (
                      <button
                        key={platform.id}
                        onClick={() => addSocialIcon(platform.id)}
                        className="flex flex-col items-center gap-1 p-3 rounded-2xl border-2 border-top hover:bg-low/20 transition-colors"
                      >
                        <Icon icon={platform.icon} className="w-5 h-5 text-high" />
                        <span className="text-xs text-high">{platform.name}</span>
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* DESIGN TAB */}
            {activeTab === 'design' && (
              <div className="rounded-4xl py-4 space-y-4">
                <div>
                  <h3 className="font-medium text-top mb-3">Free Themes</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {FREE_THEMES.map((theme) => {
                      const themeData = getTheme(theme);
                      return (
                        <ThemeCard
                          key={theme}
                          theme={theme}
                          themeData={themeData}
                          selected={themeId === theme}
                          onSelect={() => setThemeId(theme)}
                        />
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-medium text-top">Pro Themes</h3>
                    {!isPro && (
                      <span className="px-2 py-0.5 rounded-full bg-pink text-top text-xs font-bold">
                        PRO
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {PRO_THEMES.map((theme) => {
                      const themeData = getTheme(theme);
                      return (
                        <ThemeCard
                          key={theme}
                          theme={theme}
                          themeData={themeData}
                          selected={themeId === theme}
                          onSelect={() => {
                            if (!isPro) {
                              toast.error('Upgrade to Pro to use this theme');
                              return;
                            }
                            setThemeId(theme);
                          }}
                          locked={!isPro}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* LANGUAGES TAB */}
            {activeTab === 'languages' && (
              <div className="rounded-4xl py-4 space-y-4">
                <div>
                  <h3 className="font-medium text-top mb-1">Page Languages</h3>
                  <p className="text-sm text-high mb-3">
                    Visitors can switch between languages on your public page.
                  </p>

                  {/* Language pills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {pageLanguages.map((code) => {
                      const lang = SUPPORTED_LANGUAGES.find((l) => l.code === code);
                      return (
                        <div
                          key={code}
                          className={cn(
                            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-colors',
                            activeLang === code ? 'bg-green text-top' : 'bg-low text-high hover:bg-low/20'
                          )}
                          onClick={() => setActiveLang(code)}
                        >
                          <span>{lang?.flag ?? '🌐'}</span>
                          <span>{lang?.nativeName ?? code.toUpperCase()}</span>
                          {code !== 'en' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeLanguage(code);
                              }}
                              className="ml-1 opacity-60 hover:opacity-100"
                            >
                              <Icon icon="x" className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Add language */}
                  <div>
                    <p className="text-xs text-high mb-2">Add a language:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {SUPPORTED_LANGUAGES.filter((l) => !pageLanguages.includes(l.code)).map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => addLanguage(lang.code)}
                          className="flex items-center gap-2 p-2 rounded-2xl bg-low hover:bg-low/20 transition-colors text-sm"
                        >
                          <span>{lang.flag}</span>
                          <span className="text-high truncate">{lang.nativeName}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Translation editor */}
                {activeLang !== 'en' && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-top">
                      {SUPPORTED_LANGUAGES.find((l) => l.code === activeLang)?.flag}{' '}
                      {SUPPORTED_LANGUAGES.find((l) => l.code === activeLang)?.name} Translation
                    </h4>

                    <div>
                      <label className="text-sm text-high block mb-1">Display Name</label>
                      <Input
                        value={translations[activeLang]?.display_name ?? ''}
                        onChange={(e) => updateTranslation(activeLang, 'display_name', e.target.value)}
                        placeholder={displayName || 'Translated name'}
                        className="rounded-xl bg-bottom border-2 border-top"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-high block mb-1">Bio</label>
                      <Input
                        value={translations[activeLang]?.bio ?? ''}
                        onChange={(e) => updateTranslation(activeLang, 'bio', e.target.value)}
                        placeholder={bio || 'Translated bio'}
                        className="rounded-xl bg-bottom border-2 border-top"
                      />
                    </div>

                    {links.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-top mb-2">Link Titles</h5>
                        <div className="space-y-2">
                          {links
                            .filter((l) => l.title && l.url)
                            .map((link) => {
                              if (!link.id) return null;
                              return (
                                <div key={link.id} className="rounded-2xl bg-low p-3">
                                  <p className="text-xs text-high mb-1">{link.title}</p>
                                  <Input
                                    value={linkTranslations[link.id]?.[activeLang] ?? ''}
                                    onChange={(e) =>
                                      updateLinkTranslation(link.id!, activeLang, e.target.value)
                                    }
                                    placeholder={`${link.title} in ${
                                      SUPPORTED_LANGUAGES.find((l) => l.code === activeLang)?.name ?? activeLang
                                    }`}
                                    className="rounded-xl bg-bottom border-0"
                                  />
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeLang === 'en' && pageLanguages.length > 1 && (
                  <p className="text-sm text-high">
                    Select a non-English language above to add translations.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right: Live Preview */}
          <div className="lg:sticky lg:top-4">
            <div className="rounded-4xl p-2 bg-bottom">
              <p className="text-xs text-high text-center mb-2">Live Preview</p>
              <div className="h-[500px] overflow-auto rounded-3xl">
                <BioPage
                  page={previewPage}
                  links={previewLinks}
                  socialIcons={previewSocialIcons}
                  showBadge={true}
                  isPreview={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete your page?"
        description="This will permanently delete your bio page and all its data. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </DashboardLayout>
  );
}

function ThemeCard({
  theme,
  themeData,
  selected,
  onSelect,
  locked = false,
}: {
  theme: string;
  themeData: ReturnType<typeof getTheme>;
  selected: boolean;
  onSelect: () => void;
  locked?: boolean;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'rounded-3xl p-4 text-left transition-all relative',
        selected ? 'ring-2 ring-pink' : 'ring-1 ring-low',
        locked && 'opacity-70'
      )}
      style={{ background: themeData.colors.background }}
    >
      <div className="w-8 h-8 rounded-full mb-2" style={{ background: themeData.colors.primary }} />
      <span className="font-medium text-sm" style={{ color: themeData.colors.text }}>
        {themeData.name}
      </span>
      {locked && (
        <div className="absolute top-2 right-2">
          <Icon icon="lock" className="w-3.5 h-3.5 text-high" />
        </div>
      )}
    </button>
  );
}
