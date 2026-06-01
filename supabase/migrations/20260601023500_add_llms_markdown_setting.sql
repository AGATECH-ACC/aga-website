create table if not exists cms.site_settings (
  id text primary key default 'site',
  stat_counter_analyses_number integer not null default 20,
  stat_counter_analyses_suffix text not null default '+',
  stat_counter_automation_pct_number integer not null default 70,
  stat_counter_automation_pct_suffix text not null default '%',
  stat_counter_modules_number integer not null default 53,
  stat_counter_modules_suffix text not null default '+',
  llms_markdown text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table cms.site_settings
add column if not exists llms_markdown text not null default '';

insert into cms.site_settings (id)
values ('site')
on conflict (id) do nothing;

grant select, insert, update, delete on table cms.site_settings to authenticated, service_role;
