create table if not exists public.superindividual_leads (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  source text default 'website',
  created_at timestamp with time zone default now()
);

alter table public.superindividual_leads enable row level security;

drop policy if exists "Anyone can insert superindividual leads" on public.superindividual_leads;

create policy "Anyone can insert superindividual leads"
  on public.superindividual_leads
  for insert
  to anon, authenticated
  with check (true);
