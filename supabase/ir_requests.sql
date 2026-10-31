-- FIN:NECT closed-door IR session: invitation requests that a host approves.
-- Separate from `rsvps` (Demo Day, instant) on purpose: a request is not a
-- seat until a host approves it. Safe to re-run.
create table if not exists public.ir_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  organisation text not null,
  job_title text not null,
  email text not null unique,
  phone text not null,
  linkedin text,
  reason text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

-- PII: no public policies; all access is server-side with the service role.
alter table public.ir_requests enable row level security;
grant select, insert, update, delete on public.ir_requests to service_role;
