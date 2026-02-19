'use client';

import { useState } from 'react';
import { Icon, IconSize } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { detectLinkIcon, extractDomain, formatUrl } from '@/lib/icons';
import { cn } from '@/lib/utils';
import type { Link } from '@/types';

type DraftLink = Omit<Link, 'id' | 'page_id' | 'created_at'>;

interface LinkEditorProps {
  links: DraftLink[];
  onAddLink: (link: DraftLink) => void;
  onUpdateLink: (index: number, link: Partial<DraftLink>) => void;
  onRemoveLink: (index: number) => void;
  onReorderLinks: (fromIndex: number, toIndex: number) => void;
  maxLinks?: number;
}

export function LinkEditor({
  links,
  onAddLink,
  onUpdateLink,
  onRemoveLink,
  onReorderLinks,
  maxLinks = 20,
}: LinkEditorProps) {
  const [newUrl, setNewUrl] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleAddLink = () => {
    if (!newUrl.trim()) return;
    
    const formattedUrl = formatUrl(newUrl);
    const domain = extractDomain(formattedUrl);
    const icon = detectLinkIcon(formattedUrl);
    
    onAddLink({
      title: domain,
      url: formattedUrl,
      icon,
      order: links.length,
      is_active: true,
    });
    
    setNewUrl('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddLink();
    }
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== index) {
      onReorderLinks(dragIndex, index);
      setDragIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Add new link */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Icon icon="link" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-top" />
          <Input
            type="url"
            placeholder="Paste a link..."
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10 rounded-full"
          />
        </div>
        <Button
          onClick={handleAddLink}
          disabled={!newUrl.trim() || links.length >= maxLinks}
          className="shrink-0"
        >
          <Icon icon="plus" className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Links list */}
      <div className="space-y-2">
        {links.map((link, index) => (
          <div
            key={index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={cn(
              "flex items-center gap-2 p-3 border border-low rounded-lg",
              "hover:border-mid transition-colors",
              dragIndex === index && "opacity-50"
            )}
          >
            <button
              className="cursor-grab active:cursor-grabbing p-1 text-top hover:text-top"
              onMouseDown={(e) => e.preventDefault()}
            >
              <Icon icon="grip-vertical" className="w-4 h-4" />
            </button>
            
            {editingIndex === index ? (
              <div className="flex-1 space-y-2">
                <Input
                  type="text"
                  placeholder="Title"
                  value={link.title}
                  onChange={(e) => onUpdateLink(index, { title: e.target.value })}
                  className="text-sm"
                />
                <Input
                  type="url"
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => onUpdateLink(index, { url: e.target.value })}
                  className="text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingIndex(null)}
                >
                  Done
                </Button>
              </div>
            ) : (
              <>
                <div 
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => setEditingIndex(index)}
                >
                  <div className="font-medium text-sm text-top truncate">
                    {link.title}
                  </div>
                  <div className="text-xs text-top truncate">
                    {extractDomain(link.url)}
                  </div>
                </div>
                
                <button
                  onClick={() => onRemoveLink(index)}
                  className="p-1.5 text-top hover:text-red-500 transition-colors"
                >
                  <Icon icon="trash-2" className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        ))}
        
        {links.length === 0 && (
          <div className="text-center py-8 text-top">
            <Icon icon="link" className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No links yet. Paste a URL above to get started.</p>
          </div>
        )}
      </div>
      
      {/* Link count */}
      <div className="text-xs text-top text-center">
        {links.length} / {maxLinks} links
      </div>
    </div>
  );
}
