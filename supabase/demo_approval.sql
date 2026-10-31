-- FIN:NECT Demo Day is closed-door (Tammy, 31 Oct): a Demo Day RSVP is a
-- request until a host approves it in /admin. Existing rows count as
-- approved; the RSVP form writes 'pending' for new Demo Day requests.
-- Run once in the Supabase SQL editor BEFORE deploying the matching code.
alter table public.rsvps add column if not exists demo_status text not null default 'approved'
  check (demo_status in ('pending', 'approved', 'declined'));
alter table public.rsvps add column if not exists demo_decided_at timestamptz;
