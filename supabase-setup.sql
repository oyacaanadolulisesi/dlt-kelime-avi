-- DLT Kelime Avı: ortak skor tablosu (Supabase) / shared leaderboard
-- Supabase → SQL Editor → New query → bunu yapıştırıp "Run" / paste this and press "Run".

create table if not exists public.scores (
  id          bigint generated always as identity primary key,
  nickname    text    not null check (char_length(nickname) between 2 and 16),
  level       text    not null check (level in ('easy', 'hard')),
  seconds     integer not null check (seconds between 10 and 3600),
  created_at  timestamptz not null default now()
);

create index if not exists scores_level_seconds_idx on public.scores (level, seconds);

alter table public.scores enable row level security;

-- Herkes tabloyu okuyabilir / anyone can read
drop policy if exists "scores_read" on public.scores;
create policy "scores_read" on public.scores for select to anon using (true);

-- Herkes skor ekleyebilir (silemez, değiştiremez) / anyone can insert (no update/delete)
drop policy if exists "scores_insert" on public.scores;
create policy "scores_insert" on public.scores for insert to anon with check (true);

grant select, insert on public.scores to anon;
