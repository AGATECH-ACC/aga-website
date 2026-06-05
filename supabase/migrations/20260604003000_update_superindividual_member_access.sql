create table if not exists public.superindividual_leads (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  access_token uuid default gen_random_uuid(),
  tier text default 'free',
  source text default 'website',
  last_accessed timestamp with time zone,
  access_count integer default 0,
  created_at timestamp with time zone default now()
);

alter table public.superindividual_leads
  add column if not exists access_token uuid default gen_random_uuid(),
  add column if not exists tier text default 'free',
  add column if not exists last_accessed timestamp with time zone,
  add column if not exists access_count integer default 0;

update public.superindividual_leads
set access_token = gen_random_uuid()
where access_token is null;

update public.superindividual_leads
set tier = 'free'
where tier is null;

update public.superindividual_leads
set access_count = 0
where access_count is null;

alter table public.superindividual_leads
  alter column access_token set default gen_random_uuid(),
  alter column tier set default 'free',
  alter column access_count set default 0;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'superindividual_leads_email_key'
      and conrelid = 'public.superindividual_leads'::regclass
  ) then
    alter table public.superindividual_leads
      add constraint superindividual_leads_email_key unique (email);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'superindividual_leads_access_token_key'
      and conrelid = 'public.superindividual_leads'::regclass
  ) then
    alter table public.superindividual_leads
      add constraint superindividual_leads_access_token_key unique (access_token);
  end if;
end $$;

alter table public.superindividual_leads enable row level security;

drop policy if exists "Anyone can insert superindividual leads" on public.superindividual_leads;
drop policy if exists "Allow public insert" on public.superindividual_leads;
drop policy if exists "Allow read by token" on public.superindividual_leads;
drop policy if exists "Allow update access log" on public.superindividual_leads;

create policy "Allow public insert"
  on public.superindividual_leads
  for insert
  to anon
  with check (true);
