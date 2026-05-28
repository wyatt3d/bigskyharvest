-- BigSkyHarvest initial schema
-- Profiles, jobs, applications with RLS

create type user_role as enum ('farmer', 'worker');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role user_role not null,
  phone text,
  city text,
  state text,
  bio text,
  created_at timestamptz not null default now()
);

create table jobs (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text not null,
  city text not null,
  state text not null default 'MT',
  start_date date,
  end_date date,
  wage_text text,
  housing_provided boolean not null default false,
  meals_provided boolean not null default false,
  equipment text,
  contact_method text not null default 'in_app',
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index jobs_state_status_idx on jobs(state, status);
create index jobs_farmer_idx on jobs(farmer_id);

create table applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  worker_id uuid not null references profiles(id) on delete cascade,
  message text,
  worker_phone text,
  worker_email text,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  unique(job_id, worker_id)
);

create index applications_job_idx on applications(job_id);
create index applications_worker_idx on applications(worker_id);

-- updated_at trigger for jobs
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger jobs_set_updated_at
  before update on jobs
  for each row execute function set_updated_at();

-- RLS
alter table profiles enable row level security;
alter table jobs enable row level security;
alter table applications enable row level security;

-- profiles: public read (name + role + city/state only matter publicly), self-write
create policy "profiles_public_read" on profiles for select using (true);
create policy "profiles_self_insert" on profiles for insert with check (auth.uid() = id);
create policy "profiles_self_update" on profiles for update using (auth.uid() = id);

-- jobs: open ones are public; owner manages own
create policy "jobs_public_open_read" on jobs for select using (status = 'open' or farmer_id = auth.uid());
create policy "jobs_owner_insert" on jobs for insert with check (farmer_id = auth.uid());
create policy "jobs_owner_update" on jobs for update using (farmer_id = auth.uid());
create policy "jobs_owner_delete" on jobs for delete using (farmer_id = auth.uid());

-- applications: worker creates own; worker reads own; farmer reads + updates apps for own jobs
create policy "apps_worker_insert" on applications for insert with check (worker_id = auth.uid());
create policy "apps_worker_read" on applications for select using (worker_id = auth.uid());
create policy "apps_farmer_read" on applications for select using (
  exists (select 1 from jobs where jobs.id = applications.job_id and jobs.farmer_id = auth.uid())
);
create policy "apps_farmer_update" on applications for update using (
  exists (select 1 from jobs where jobs.id = applications.job_id and jobs.farmer_id = auth.uid())
);
