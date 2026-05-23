create schema if not exists cms;

create extension if not exists pgcrypto;

create table if not exists cms.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role text not null default 'editor' check (role in ('owner', 'editor')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists cms.content_entries (
  id uuid primary key default gen_random_uuid(),
  collection text not null check (
    collection in ('products', 'industries', 'case_studies', 'events', 'about')
  ),
  slug text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  unique (collection, slug)
);

create table if not exists cms.content_locales (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references cms.content_entries(id) on delete cascade,
  locale text not null check (locale in ('en', 'zh')),
  title text not null default '',
  accent text not null default '',
  summary text not null default '',
  body text not null default '',
  fields jsonb not null default '{}'::jsonb,
  seo jsonb not null default '{}'::jsonb,
  draft_title text not null default '',
  draft_accent text not null default '',
  draft_summary text not null default '',
  draft_body text not null default '',
  draft_fields jsonb not null default '{}'::jsonb,
  draft_seo jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (entry_id, locale)
);

create table if not exists cms.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'aga-website-media',
  path text not null unique,
  public_url text not null default '',
  alt_text text not null default '',
  notes text not null default '',
  collection text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists cms.content_media (
  entry_id uuid not null references cms.content_entries(id) on delete cascade,
  media_id uuid not null references cms.media_assets(id) on delete cascade,
  usage text not null default 'gallery',
  sort_order integer not null default 0,
  primary key (entry_id, media_id, usage)
);

create or replace function cms.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_admin_users_updated_at on cms.admin_users;
create trigger touch_admin_users_updated_at
before update on cms.admin_users
for each row execute function cms.touch_updated_at();

drop trigger if exists touch_content_entries_updated_at on cms.content_entries;
create trigger touch_content_entries_updated_at
before update on cms.content_entries
for each row execute function cms.touch_updated_at();

drop trigger if exists touch_content_locales_updated_at on cms.content_locales;
create trigger touch_content_locales_updated_at
before update on cms.content_locales
for each row execute function cms.touch_updated_at();

drop trigger if exists touch_media_assets_updated_at on cms.media_assets;
create trigger touch_media_assets_updated_at
before update on cms.media_assets
for each row execute function cms.touch_updated_at();

alter table cms.admin_users enable row level security;
alter table cms.content_entries enable row level security;
alter table cms.content_locales enable row level security;
alter table cms.media_assets enable row level security;
alter table cms.content_media enable row level security;

create or replace function cms.is_admin()
returns boolean
language sql
stable
security definer
set search_path = cms, public
as $$
  select exists (
    select 1
    from cms.admin_users
    where email = auth.email()
      and active = true
  );
$$;

drop policy if exists "cms admins read admin users" on cms.admin_users;
create policy "cms admins read admin users"
on cms.admin_users for select
to authenticated
using (cms.is_admin());

drop policy if exists "cms admins manage entries" on cms.content_entries;
create policy "cms admins manage entries"
on cms.content_entries for all
to authenticated
using (cms.is_admin())
with check (cms.is_admin());

drop policy if exists "cms admins manage locales" on cms.content_locales;
create policy "cms admins manage locales"
on cms.content_locales for all
to authenticated
using (cms.is_admin())
with check (cms.is_admin());

drop policy if exists "cms admins manage media" on cms.media_assets;
create policy "cms admins manage media"
on cms.media_assets for all
to authenticated
using (cms.is_admin())
with check (cms.is_admin());

drop policy if exists "cms admins manage content media" on cms.content_media;
create policy "cms admins manage content media"
on cms.content_media for all
to authenticated
using (cms.is_admin())
with check (cms.is_admin());

grant usage on schema cms to authenticated, service_role;
grant select, insert, update, delete on all tables in schema cms to authenticated, service_role;
grant usage, select on all sequences in schema cms to authenticated, service_role;

insert into storage.buckets (id, name, public)
values ('aga-website-media', 'aga-website-media', true)
on conflict (id) do nothing;

drop policy if exists "cms admins upload website media" on storage.objects;
create policy "cms admins upload website media"
on storage.objects for insert
to authenticated
with check (bucket_id = 'aga-website-media' and cms.is_admin());

drop policy if exists "cms admins update website media" on storage.objects;
create policy "cms admins update website media"
on storage.objects for update
to authenticated
using (bucket_id = 'aga-website-media' and cms.is_admin())
with check (bucket_id = 'aga-website-media' and cms.is_admin());

drop policy if exists "cms admins read website media" on storage.objects;
create policy "cms admins read website media"
on storage.objects for select
to authenticated
using (bucket_id = 'aga-website-media' and cms.is_admin());

drop policy if exists "public read website media" on storage.objects;
create policy "public read website media"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'aga-website-media');
