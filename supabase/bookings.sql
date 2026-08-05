-- Run this once in the Supabase SQL editor.
create table if not exists public.bookings (
  id          bigint generated always as identity primary key,
  ref         text not null unique,
  service     text,
  ign         text not null,
  current_mmr integer,
  target_mmr  integer,
  date        date,
  slot        text,
  pay_with    text,
  amount      integer,
  status      text not null default 'pending',  -- pending → confirmed / rejected
  created_at  timestamptz not null default now()
);

-- Lock it down: the serverless function uses the service-role key, which
-- bypasses RLS. No public policies means the anon key can't read or write.
alter table public.bookings enable row level security;

-- If you already created the table before the amount column existed:
-- alter table public.bookings add column if not exists amount integer;
