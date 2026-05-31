create schema if not exists cms;
create extension if not exists pgcrypto;

create or replace function cms.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists cms.ai_audit_leads (
  id uuid primary key default gen_random_uuid(),
  locale text not null default 'en' check (locale in ('en', 'zh')),
  email text not null,
  company text not null default '',
  industry text not null default '',
  headcount text not null default '',
  role text not null default '',
  email_verified_at timestamptz,
  last_verification_sent_at timestamptz,
  generated_report_at timestamptz,
  contact_requested_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists cms.ai_audit_email_verifications (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references cms.ai_audit_leads(id) on delete cascade,
  email text not null,
  code_hash text not null,
  expires_at timestamptz not null,
  verified_at timestamptz,
  attempts integer not null default 0,
  resend_email_id text,
  created_at timestamptz not null default now()
);

create table if not exists cms.ai_audit_reports (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references cms.ai_audit_leads(id) on delete cascade,
  report_reference_id text not null unique,
  locale text not null default 'en' check (locale in ('en', 'zh')),
  profile jsonb not null default '{}'::jsonb,
  answers jsonb not null default '{}'::jsonb,
  selected_workflows jsonb not null default '[]'::jsonb,
  score integer not null default 0,
  source text not null default 'fallback' check (source in ('openai', 'fallback')),
  report jsonb not null default '{}'::jsonb,
  contact_requested_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ai_audit_leads_email_idx on cms.ai_audit_leads (lower(email));
create index if not exists ai_audit_email_verifications_lead_id_idx on cms.ai_audit_email_verifications (lead_id);
create index if not exists ai_audit_reports_lead_id_idx on cms.ai_audit_reports (lead_id);

grant usage on schema cms to service_role;
grant select, insert, update, delete on table cms.ai_audit_leads to service_role;
grant select, insert, update, delete on table cms.ai_audit_email_verifications to service_role;
grant select, insert, update, delete on table cms.ai_audit_reports to service_role;

drop trigger if exists touch_ai_audit_leads_updated_at on cms.ai_audit_leads;
create trigger touch_ai_audit_leads_updated_at
before update on cms.ai_audit_leads
for each row execute function cms.touch_updated_at();

drop trigger if exists touch_ai_audit_reports_updated_at on cms.ai_audit_reports;
create trigger touch_ai_audit_reports_updated_at
before update on cms.ai_audit_reports
for each row execute function cms.touch_updated_at();
