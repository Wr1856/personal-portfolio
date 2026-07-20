-- Row Level Security: public readers see only published content; the single
-- authorized administrator (matched by e-mail) manages everything.

-- Admin allowlist ------------------------------------------------------------

create table public.admin_emails (
  email text primary key
);

alter table public.admin_emails enable row level security;
-- No policies: the table is only reachable through is_admin() below.

insert into public.admin_emails (email) values ('w.maia.1856@gmail.com');

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_emails a
    where a.email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- Enable RLS everywhere ---------------------------------------------------

alter table public.site_profile enable row level security;
alter table public.projects enable row level security;
alter table public.certifications enable row level security;
alter table public.experiences enable row level security;
alter table public.services enable row level security;
alter table public.contact_requests enable row level security;

-- site_profile: everyone can read the single public profile row; only the
-- admin can change it.

create policy "site_profile_public_read"
  on public.site_profile for select
  using (true);

create policy "site_profile_admin_write"
  on public.site_profile for all
  using (public.is_admin())
  with check (public.is_admin());

-- projects

create policy "projects_public_read_published"
  on public.projects for select
  using (is_published = true or public.is_admin());

create policy "projects_admin_insert"
  on public.projects for insert
  with check (public.is_admin());

create policy "projects_admin_update"
  on public.projects for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "projects_admin_delete"
  on public.projects for delete
  using (public.is_admin());

-- certifications

create policy "certifications_public_read_published"
  on public.certifications for select
  using (is_published = true or public.is_admin());

create policy "certifications_admin_insert"
  on public.certifications for insert
  with check (public.is_admin());

create policy "certifications_admin_update"
  on public.certifications for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "certifications_admin_delete"
  on public.certifications for delete
  using (public.is_admin());

-- experiences

create policy "experiences_public_read_published"
  on public.experiences for select
  using (is_published = true or public.is_admin());

create policy "experiences_admin_insert"
  on public.experiences for insert
  with check (public.is_admin());

create policy "experiences_admin_update"
  on public.experiences for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "experiences_admin_delete"
  on public.experiences for delete
  using (public.is_admin());

-- services

create policy "services_public_read_published"
  on public.services for select
  using (is_published = true or public.is_admin());

create policy "services_admin_insert"
  on public.services for insert
  with check (public.is_admin());

create policy "services_admin_update"
  on public.services for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "services_admin_delete"
  on public.services for delete
  using (public.is_admin());

-- contact_requests: no anonymous access at all. Inserts happen exclusively
-- through the validated server endpoint using the service role (which
-- bypasses RLS). The admin can read and manage requests.

create policy "contact_requests_admin_read"
  on public.contact_requests for select
  using (public.is_admin());

create policy "contact_requests_admin_update"
  on public.contact_requests for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "contact_requests_admin_delete"
  on public.contact_requests for delete
  using (public.is_admin());
