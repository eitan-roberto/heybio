'use client';

import { useState } from 'react';
import { Save, Eye, Trash2, Plus, GripVertical } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ThemePicker } from '@/components/onboarding/ThemePicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BioPage } from '@/components/bio-page';
import { cn } from '@/lib/utils';

// Demo data
const DEMO_PAGE = {
  slug: 'demo',
  display_name: 'Alex Demo',
  bio: 'Creator, builder, dreamer ✨',
  avatar_url: '',
  theme_id: 'clean',
};

const DEMO_LINKS = [
  { id: '1', title: 'My YouTube Channel', url: 'https://youtube.com/@demo', is_active: true },
  { id: '2', title: 'Latest Blog Post', url: 'https://medium.com/@demo', is_active: true },
  { id: '3', title: 'Book a Call', url: 'https://calendly.com/demo', is_active: true },
  { id: '4', title: 'My Newsletter', url: 'https://substack.com/@demo', is_active: true },
];

export default function EditPage() {
  const [displayName, setDisplayName] = useState(DEMO_PAGE.display_name);
  const [bio, setBio] = useState(DEMO_PAGE.bio);
  const [themeId, setThemeId] = useState(DEMO_PAGE.theme_id);
  const [links, setLinks] = useState(DEMO_LINKS);
  const [showPreview, setShowPreview] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = () => {
    // TODO: Save to Supabase
    alert('Changes saved! (Demo only - Supabase integration pending)');
    setHasChanges(false);
  };

  const updateField = <T,>(setter: (v: T) => void, value: T) => {
    setter(value);
    setHasChanges(true);
  };

  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Preview data
  const previewPage = {
    display_name: displayName,
    bio,
    avatar_url: DEMO_PAGE.avatar_url,
    theme_id: themeId,
    slug: DEMO_PAGE.slug,
  };

  const previewLinks = links.map((link, index) => ({
    ...link,
    order: index,
    is_active: link.is_active,
  }));

  return (
    <DashboardLayout pageSlug={DEMO_PAGE.slug}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Page</h1>
            <p className="text-gray-500 mt-1">
              Customize your bio page
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? 'Hide' : 'Show'} Preview
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <div className={cn(
          "grid gap-6",
          showPreview ? "lg:grid-cols-2" : "lg:grid-cols-1"
        )}>
          {/* Editor */}
          <div className="space-y-6">
            {/* Profile */}
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Your public profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={DEMO_PAGE.avatar_url} />
                    <AvatarFallback className="text-lg bg-gray-200">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Change photo
                  </Button>
                </div>

                {/* Display name */}
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => updateField(setDisplayName, e.target.value)}
                    placeholder="Your name"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    value={bio}
                    onChange={(e) => updateField(setBio, e.target.value)}
                    placeholder="A short bio about you"
                  />
                  <p className="text-xs text-gray-400">{bio.length}/150 characters</p>
                </div>
              </CardContent>
            </Card>

            {/* Links */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Links</CardTitle>
                    <CardDescription>Manage your links</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Link
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {links.map((link, index) => (
                    <div
                      key={link.id}
                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                    >
                      <button className="cursor-grab text-gray-400 hover:text-gray-600">
                        <GripVertical className="w-4 h-4" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <Input
                          value={link.title}
                          onChange={(e) => {
                            const newLinks = [...links];
                            newLinks[index].title = e.target.value;
                            updateField(setLinks, newLinks);
                          }}
                          className="mb-1"
                        />
                        <Input
                          value={link.url}
                          onChange={(e) => {
                            const newLinks = [...links];
                            newLinks[index].url = e.target.value;
                            updateField(setLinks, newLinks);
                          }}
                          className="text-sm"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const newLinks = links.filter((_, i) => i !== index);
                          updateField(setLinks, newLinks);
                        }}
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Theme */}
            <Card>
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>Choose your page style</CardDescription>
              </CardHeader>
              <CardContent>
                <ThemePicker
                  selectedThemeId={themeId}
                  onSelectTheme={(id) => updateField(setThemeId, id)}
                  showProThemes={true}
                />
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="sticky top-6">
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Live Preview</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[600px] overflow-auto border-t">
                    <BioPage
                      page={previewPage}
                      links={previewLinks}
                      socialIcons={[]}
                      showBadge={true}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
