import { notFound } from 'next/navigation';
import { createStaticClient } from '@/lib/supabase/static';
import { LinkRedirect } from './LinkRedirect';

export default async function LinkPage({ params }: { params: Promise<{ linkId: string }> }) {
  const { linkId } = await params;
  const supabase = createStaticClient();

  const { data } = await supabase
    .from('links')
    .select('id, url, title, is_nsfw, page_id, pages(id, avatar_url, cover_image_url, display_name)')
    .eq('id', linkId)
    .eq('is_active', true)
    .single();

  if (!data || !data.is_nsfw) return notFound();

  const page = Array.isArray(data.pages) ? data.pages[0] : data.pages;

  return (
    <LinkRedirect
      url={data.url}
      title={data.title}
      linkId={data.id}
      pageId={page?.id ?? data.page_id}
      avatarUrl={page?.avatar_url ?? null}
      coverImageUrl={page?.cover_image_url ?? null}
      displayName={page?.display_name ?? null}
    />
  );
}
