-- HeyBio Database Schema
-- Initial migration

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  stripe_customer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Pages table (bio pages)
create table public.pages (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles on delete cascade not null,
  slug text unique not null,
  display_name text not null,
  bio text,
  avatar_url text,
  theme_id text not null default 'clean',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Links table
create table public.links (
  id uuid primary key default uuid_generate_v4(),
  page_id uuid references public.pages on delete cascade not null,
  title text not null,
  url text not null,
  icon text,
  position integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Social icons table
create table public.social_icons (
  id uuid primary key default uuid_generate_v4(),
  page_id uuid references public.pages on delete cascade not null,
  platform text not null,
  url text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

-- Page views (analytics)
create table public.page_views (
  id uuid primary key default uuid_generate_v4(),
  page_id uuid references public.pages on delete cascade not null,
  referrer text,
  country text,
  device text check (device in ('mobile', 'desktop', 'tablet')),
  created_at timestamptz not null default now()
);

-- Link clicks (analytics)
create table public.link_clicks (
  id uuid primary key default uuid_generate_v4(),
  link_id uuid references public.links on delete cascade not null,
  page_id uuid references public.pages on delete cascade not null,
  referrer text,
  created_at timestamptz not null default now()
);

-- Indexes for performance
create index pages_user_id_idx on public.pages(user_id);
create index pages_slug_idx on public.pages(slug);
create index links_page_id_idx on public.links(page_id);
create index social_icons_page_id_idx on public.social_icons(page_id);
create index page_views_page_id_idx on public.page_views(page_id);
create index page_views_created_at_idx on public.page_views(created_at);
create index link_clicks_page_id_idx on public.link_clicks(page_id);
create index link_clicks_link_id_idx on public.link_clicks(link_id);
create index link_clicks_created_at_idx on public.link_clicks(created_at);

-- Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.pages enable row level security;
alter table public.links enable row level security;
alter table public.social_icons enable row level security;
alter table public.page_views enable row level security;
alter table public.link_clicks enable row level security;

-- Profiles policies
create policy "Users can view own profile" 
  on public.profiles for select 
  using (auth.uid() = id);

create policy "Users can update own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

-- Pages policies
create policy "Anyone can view published pages" 
  on public.pages for select 
  using (is_published = true);

create policy "Users can view own pages" 
  on public.pages for select 
  using (auth.uid() = user_id);

create policy "Users can insert own pages" 
  on public.pages for insert 
  with check (auth.uid() = user_id);

create policy "Users can update own pages" 
  on public.pages for update 
  using (auth.uid() = user_id);

create policy "Users can delete own pages" 
  on public.pages for delete 
  using (auth.uid() = user_id);

-- Links policies
create policy "Anyone can view links of published pages" 
  on public.links for select 
  using (
    exists (
      select 1 from public.pages 
      where pages.id = links.page_id 
      and pages.is_published = true
    )
  );

create policy "Users can manage own links" 
  on public.links for all 
  using (
    exists (
      select 1 from public.pages 
      where pages.id = links.page_id 
      and pages.user_id = auth.uid()
    )
  );

-- Social icons policies
create policy "Anyone can view social icons of published pages" 
  on public.social_icons for select 
  using (
    exists (
      select 1 from public.pages 
      where pages.id = social_icons.page_id 
      and pages.is_published = true
    )
  );

create policy "Users can manage own social icons" 
  on public.social_icons for all 
  using (
    exists (
      select 1 from public.pages 
      where pages.id = social_icons.page_id 
      and pages.user_id = auth.uid()
    )
  );

-- Analytics policies (insert only for public, select for owner)
create policy "Anyone can insert page views" 
  on public.page_views for insert 
  with check (true);

create policy "Users can view own page analytics" 
  on public.page_views for select 
  using (
    exists (
      select 1 from public.pages 
      where pages.id = page_views.page_id 
      and pages.user_id = auth.uid()
    )
  );

create policy "Anyone can insert link clicks" 
  on public.link_clicks for insert 
  with check (true);

create policy "Users can view own link analytics" 
  on public.link_clicks for select 
  using (
    exists (
      select 1 from public.pages 
      where pages.id = link_clicks.page_id 
      and pages.user_id = auth.uid()
    )
  );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

create trigger update_pages_updated_at
  before update on public.pages
  for each row execute procedure public.update_updated_at();
