create schema if not exists cms;
create extension if not exists pgcrypto;

create table if not exists cms.insights (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  display_order integer default 0,

  title_en text not null,
  title_zh text,

  summary_en text,
  summary_zh text,

  body_en text,
  body_zh text,

  cover_image text,
  author_name text,
  author_image text,
  author_title text,

  category text,
  tags text[],
  reading_time_minutes integer,

  seo_title_en text,
  seo_title_zh text,
  meta_description_en text,
  meta_description_zh text,

  faq_en jsonb,
  faq_zh jsonb,

  is_active boolean default false,
  is_featured boolean default false,

  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

grant usage on schema cms to service_role;
grant select, insert, update, delete on table cms.insights to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'insight-images',
  'insight-images',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

with legacy as (
  select
    regexp_replace(path, '^insights/', '') as slug,
    coalesce(nullif(alt_text, ''), regexp_replace(path, '^insights/', '')) as title_en,
    case
      when notes is not null and btrim(notes) like '{%' then notes::jsonb
      else '{}'::jsonb
    end as notes_json,
    created_at,
    updated_at
  from cms.media_assets
  where collection = 'insights'
)
insert into cms.insights (
  slug,
  display_order,
  title_en,
  summary_en,
  body_en,
  is_active,
  published_at,
  created_at,
  updated_at
)
select
  slug,
  coalesce((notes_json ->> 'displayOrder')::integer, 0) as display_order,
  title_en,
  nullif(notes_json ->> 'summary', '') as summary_en,
  nullif(notes_json ->> 'body', '') as body_en,
  coalesce((notes_json ->> 'isActive')::boolean, false) as is_active,
  case
    when coalesce((notes_json ->> 'isActive')::boolean, false)
      then coalesce(nullif(notes_json ->> 'updatedAt', '')::timestamptz, updated_at, now())
    else null
  end as published_at,
  created_at,
  coalesce(nullif(notes_json ->> 'updatedAt', '')::timestamptz, updated_at, now()) as updated_at
from legacy
on conflict (slug) do update set
  display_order = excluded.display_order,
  title_en = excluded.title_en,
  summary_en = excluded.summary_en,
  body_en = excluded.body_en,
  is_active = excluded.is_active,
  published_at = excluded.published_at,
  updated_at = excluded.updated_at;
