-- Wesley Maia portfolio — core schema.
-- Run order: 0001 → 0005.

create extension if not exists "pgcrypto";

-- Enumerated types -----------------------------------------------------------

create type public.project_type as enum (
  'professional',
  'brand',
  'academic',
  'conceptual',
  'in_development'
);

create type public.project_status as enum (
  'completed',
  'in_progress',
  'maintained',
  'archived'
);

create type public.contact_category as enum (
  'build_site',
  'fix_problem',
  'promote_business',
  'improve_identity',
  'meet_wesley',
  'other'
);

create type public.preferred_contact as enum ('email', 'whatsapp');

create type public.contact_status as enum (
  'new',
  'in_review',
  'answered',
  'archived'
);

create type public.site_locale as enum ('pt', 'en');

-- updated_at trigger ----------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Tables ----------------------------------------------------------------------

create table public.site_profile (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  professional_title_pt text not null,
  professional_title_en text not null,
  bio_pt text not null,
  bio_en text not null,
  email text not null,
  whatsapp text not null,
  github_url text not null,
  resume_path text,
  profile_image_path text,
  ai_visible boolean not null default true,
  updated_at timestamptz not null default now()
);

create trigger site_profile_updated_at
  before update on public.site_profile
  for each row execute function public.set_updated_at();

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_pt text not null,
  title_en text not null,
  summary_pt text not null,
  summary_en text not null,
  problem_pt text not null,
  problem_en text not null,
  solution_pt text not null,
  solution_en text not null,
  result_pt text,
  result_en text,
  category text not null,
  project_type public.project_type not null,
  status public.project_status not null default 'completed',
  technologies text[] not null default '{}',
  cover_path text,
  video_url text,
  demo_url text,
  repository_url text,
  original_url text,
  featured boolean not null default false,
  is_published boolean not null default false,
  ai_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

create index projects_category_idx on public.projects (category);
create index projects_is_published_idx on public.projects (is_published);
create index projects_featured_idx on public.projects (featured);
create index projects_sort_order_idx on public.projects (sort_order);
create index projects_created_at_idx on public.projects (created_at desc);

create table public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  category text not null,
  issue_date date not null,
  expiration_date date,
  credential_code text,
  credential_url text,
  private_file_path text,
  featured boolean not null default false,
  is_published boolean not null default false,
  ai_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger certifications_updated_at
  before update on public.certifications
  for each row execute function public.set_updated_at();

create index certifications_category_idx on public.certifications (category);
create index certifications_is_published_idx on public.certifications (is_published);
create index certifications_featured_idx on public.certifications (featured);
create index certifications_sort_order_idx on public.certifications (sort_order);
create index certifications_created_at_idx on public.certifications (created_at desc);

create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role_pt text not null,
  role_en text not null,
  description_pt text not null,
  description_en text not null,
  start_date date not null,
  end_date date,
  is_current boolean not null default false,
  skills text[] not null default '{}',
  is_published boolean not null default false,
  ai_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger experiences_updated_at
  before update on public.experiences
  for each row execute function public.set_updated_at();

create index experiences_is_published_idx on public.experiences (is_published);
create index experiences_sort_order_idx on public.experiences (sort_order);
create index experiences_created_at_idx on public.experiences (created_at desc);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_pt text not null,
  title_en text not null,
  description_pt text not null,
  description_en text not null,
  category public.contact_category not null,
  scope_pt text not null,
  scope_en text not null,
  starting_price numeric(10, 2),
  remote_available boolean not null default true,
  onsite_available boolean not null default false,
  featured boolean not null default false,
  is_published boolean not null default false,
  ai_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint services_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

create trigger services_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

create index services_category_idx on public.services (category);
create index services_is_published_idx on public.services (is_published);
create index services_featured_idx on public.services (featured);
create index services_sort_order_idx on public.services (sort_order);
create index services_created_at_idx on public.services (created_at desc);

create table public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  whatsapp text,
  category public.contact_category not null,
  message text not null,
  preferred_contact public.preferred_contact not null,
  locale public.site_locale not null default 'pt',
  consent_at timestamptz not null,
  status public.contact_status not null default 'new',
  created_at timestamptz not null default now(),
  constraint contact_requests_reachable check (
    email is not null or whatsapp is not null
  )
);

create index contact_requests_created_at_idx on public.contact_requests (created_at desc);
create index contact_requests_status_idx on public.contact_requests (status);
