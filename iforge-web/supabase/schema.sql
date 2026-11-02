-- iForge admin panel — Supabase schema
--
-- Run this once in your Supabase project (SQL Editor → New query → paste → Run).
-- It creates the single table that stores all admin-editable site content as
-- one JSON document, and the policies that let the public read it while only
-- the service-role key (used by the server) can write.

create table if not exists public.site_content (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Seed the single row the app reads/writes.
insert into public.site_content (id, data)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;

-- Row-level security: anyone may READ the published content; nobody may write
-- with the anon key. The server writes with the service-role key, which bypasses
-- RLS, so no write policy is needed.
alter table public.site_content enable row level security;

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
  on public.site_content
  for select
  using (true);

-- ─────────────────────────────────────────────────────────────
-- Enquiries from the contact form and quote wizard (admin inbox).
-- Only the server touches this table, using the service-role key, so RLS is
-- on with no policies: the public anon key can neither read nor write it.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.inquiries (
  id text primary key,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  data jsonb not null
);

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists inquiries_status_idx on public.inquiries (status);

alter table public.inquiries enable row level security;

-- ─────────────────────────────────────────────────────────────
-- Private settings from the admin panel (e.g. the outgoing mail server and
-- its password). RLS on with no policies: only the server's service-role key
-- can read or write it — never the public anon key.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.app_settings (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.app_settings enable row level security;

-- ─────────────────────────────────────────────────────────────
-- Public "media" bucket for team photos uploaded from the admin panel.
-- Anyone can view the images; only the server (service role) uploads.
-- ─────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;
