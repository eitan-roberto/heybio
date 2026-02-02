'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BioPage } from '@/components/bio-page';
import { getTheme } from '@/config/themes';
import { createClient } from '@/lib/supabase/client';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { cn } from '@/lib/utils';

interface Link {
  id?: string;
  title: string;
  url: string;
  order: number;
  is_active: boolean;
}

const THEMES = ['clean', 'soft', 'bold', 'dark', 'warm', 'minimal'];

export default function EditPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageId, setPageId] = useState<string | null>(null);
  const [slug, setSlug] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [themeId, setThemeId] = useState('clean');
  const [links, setLinks] = useState<Link[]>([]);
  const [activeTab, setActiveTab] = useState<'links' | 'design'>('links');
  const [message, setMessage] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Load page data
  useEffect(() => {
    const loadPage = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's page
      const { data: page } = await supabase
        .from('pages')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!page) {
        setLoading(false);
        return;
      }

      setPageId(page.id);
      setSlug(page.slug);
      setDisplayName(page.display_name);
      setBio(page.bio || '');
      setThemeId(page.theme_id);

      // Get links
      const { data: pageLinks, error: linksError } = await supabase
        .from('links')
        .select('*')
        .eq('page_id', page.id)
        .order('order');
      
      if (linksError) {
        console.error('Error loading links:', linksError);
      }
      
      console.log('Loaded links:', pageLinks);

      setLinks(pageLinks?.map((l: any) => ({
        id: l.id,
        title: l.title,
        url: l.url,
        order: l.order,
        is_active: l.is_active ?? true,
      })) || []);

      setLoading(false);
    };

    loadPage();
  }, []);

  const handleSave = async () => {
    if (!pageId) return;
    setSaving(true);
    setMessage('Saving...');

    const supabase = createClient();

    // Update page
    const { error: pageError } = await supabase
      .from('pages')
      .update({
        display_name: displayName,
        bio,
        theme_id: themeId,
      })
      .eq('id', pageId);

    if (pageError) {
      console.error('Page update error:', pageError);
      setMessage('Error saving page');
      setSaving(false);
      return;
    }

    // Handle links - track new links to update state
    const updatedLinks = [...links];
    
    for (let i = 0; i < updatedLinks.length; i++) {
      const link = updatedLinks[i];
      
      if (link.id) {
        // Update existing
        const { error } = await supabase.from('links').update({
          title: link.title,
          url: link.url,
          order: link.order,
          is_active: link.is_active,
        }).eq('id', link.id);
        
        if (error) {
          console.error('Link update error:', error);
        }
      } else {
        // Insert new
        console.log('Inserting new link:', link);
        const { data, error } = await supabase.from('links').insert({
          page_id: pageId,
          title: link.title,
          url: link.url,
          order: link.order,
          is_active: link.is_active,
        }).select().single();
        
        if (error) {
          console.error('Link insert error:', error);
        } else if (data) {
          console.log('New link created:', data);
          updatedLinks[i] = { ...link, id: data.id };
        }
      }
    }

    // Update state with IDs
    setLinks(updatedLinks);
    
    setMessage('Saved!');
    setTimeout(() => setMessage(''), 2000);
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!pageId) return;
    setDeleting(true);
    
    const supabase = createClient();
    const { error } = await supabase.from('pages').delete().eq('id', pageId);
    
    if (error) {
      setMessage('Error deleting page');
      setDeleting(false);
      return;
    }
    
    router.push('/dashboard');
  };

  const addLink = () => {
    setLinks([...links, {
      title: '',
      url: '',
      order: links.length,
      is_active: true,
    }]);
  };

  const updateLink = (index: number, updates: Partial<Link>) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], ...updates };
    setLinks(newLinks);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const moveLink = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= links.length) return;
    const newLinks = [...links];
    [newLinks[index], newLinks[newIndex]] = [newLinks[newIndex], newLinks[index]];
    newLinks.forEach((l, i) => l.order = i);
    setLinks(newLinks);
  };

  // Preview data
  const previewPage = {
    display_name: displayName || 'Your Name',
    bio: bio || '',
    avatar_url: '',
    theme_id: themeId,
    slug: slug || 'preview',
  };

  const previewLinks = links.filter(l => l.is_active && l.title && l.url).map((link, index) => ({
    ...link,
    order: index,
  }));

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
          <p className="text-high mb-4">Create a page first</p>
          <Button className="rounded-full bg-green text-top hover:bg-green/80" asChild>
            <Link href="/new">Create page</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageSlug={slug}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-top">Edit Page</h1>
          <div className="flex items-center gap-2">
            {message && (
              <span className={cn(
                "text-sm",
                message.includes('Error') ? 'text-orange' : 'text-green'
              )}>
                {message}
              </span>
            )}
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
        <div className="rounded-4xl p-4 bg-bottom">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-high block mb-1">Display Name</label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="rounded-xl bg-low border-0"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-sm text-high block mb-1">Bio</label>
              <Input
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="rounded-xl bg-low border-0"
                placeholder="Short bio"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('links')}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              activeTab === 'links' ? 'bg-green text-top' : 'bg-bottom text-high hover:bg-low'
            )}
          >
            Links ({links.length})
          </button>
          <button
            onClick={() => setActiveTab('design')}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              activeTab === 'design' ? 'bg-green text-top' : 'bg-bottom text-high hover:bg-low'
            )}
          >
            Design
          </button>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Left: Editor */}
          <div className="space-y-4">
            {activeTab === 'links' ? (
              <div className="rounded-4xl p-4 bg-bottom space-y-3">
                {links.map((link, index) => (
                  <div key={index} className="rounded-3xl p-3 bg-low">
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        onClick={() => moveLink(index, -1)}
                        disabled={index === 0}
                        className="p-1 text-high disabled:opacity-30"
                      >
                        <Icon icon="arrow-left" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveLink(index, 1)}
                        disabled={index === links.length - 1}
                        className="p-1 text-high disabled:opacity-30"
                      >
                        <Icon icon="arrow-right" className="w-4 h-4" />
                      </button>
                      <div className="flex-1" />
                      <button
                        onClick={() => updateLink(index, { is_active: !link.is_active })}
                        className={cn(
                          "p-1 rounded",
                          link.is_active ? 'text-green' : 'text-high'
                        )}
                      >
                        <Icon icon={link.is_active ? "eye" : "eye"} className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeLink(index)}
                        className="p-1 text-high hover:text-orange"
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
                  </div>
                ))}
                
                <Button
                  onClick={addLink}
                  variant="outline"
                  className="w-full rounded-full py-6 border-dashed"
                >
                  <Icon icon="plus" className="w-5 h-5 mr-2" />
                  Add Link
                </Button>
              </div>
            ) : (
              <div className="rounded-4xl p-4 bg-bottom">
                <h3 className="font-medium text-top mb-4">Choose Theme</h3>
                <div className="grid grid-cols-2 gap-3">
                  {THEMES.map((theme) => {
                    const themeData = getTheme(theme);
                    return (
                      <button
                        key={theme}
                        onClick={() => setThemeId(theme)}
                        className={cn(
                          "rounded-3xl p-4 text-left transition-all",
                          themeId === theme ? 'ring-2 ring-pink' : 'ring-1 ring-low'
                        )}
                        style={{ background: themeData.colors.background }}
                      >
                        <div
                          className="w-8 h-8 rounded-full mb-2"
                          style={{ background: themeData.colors.primary }}
                        />
                        <span
                          className="font-medium text-sm"
                          style={{ color: themeData.colors.text }}
                        >
                          {themeData.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
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
                  socialIcons={[]}
                  showBadge={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
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
