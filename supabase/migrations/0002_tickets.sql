-- Trouble-ticket system: anyone can submit; only admins read.

create table tickets (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references auth.users(id) on delete set null,
  reporter_email text,
  page_url text not null,
  element_selector text,
  element_html text,
  viewport_w int,
  viewport_h int,
  description text not null,
  status text not null default 'open',
  resolved_at timestamptz,
  resolved_note text,
  created_at timestamptz not null default now()
);

create index tickets_status_created_idx on tickets(status, created_at desc);

alter table tickets enable row level security;

-- Anyone (auth'd or anon) can submit a ticket
create policy "tickets_public_insert" on tickets for insert with check (true);

-- Reporters can read their own
create policy "tickets_self_read" on tickets for select using (reporter_id = auth.uid());

-- Admin reads/updates handled via service-role client, not RLS.
