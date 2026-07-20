-- Read model for the future AI assistant (v2).
-- Exposes ONLY public, published content. It deliberately excludes:
-- contact details, authentication data, private files, administrative
-- e-mails, logs, secrets, and anything submitted by visitors.

create view public.public_ai_knowledge
with (security_invoker = on)
as
-- Public professional profile (no e-mail, no WhatsApp, no file paths).
select
  'profile' as entity_type,
  p.id as entity_id,
  jsonb_build_object(
    'name', p.name,
    'professional_title_pt', p.professional_title_pt,
    'professional_title_en', p.professional_title_en,
    'bio_pt', p.bio_pt,
    'bio_en', p.bio_en,
    'github_url', p.github_url
  ) as data
from public.site_profile p
where p.ai_visible = true

union all

select
  'service' as entity_type,
  s.id as entity_id,
  jsonb_build_object(
    'slug', s.slug,
    'title_pt', s.title_pt,
    'title_en', s.title_en,
    'description_pt', s.description_pt,
    'description_en', s.description_en,
    'category', s.category,
    'scope_pt', s.scope_pt,
    'scope_en', s.scope_en,
    'starting_price', s.starting_price,
    'remote_available', s.remote_available,
    'onsite_available', s.onsite_available
  ) as data
from public.services s
where s.is_published = true and s.ai_visible = true

union all

select
  'project' as entity_type,
  pr.id as entity_id,
  jsonb_build_object(
    'slug', pr.slug,
    'title_pt', pr.title_pt,
    'title_en', pr.title_en,
    'summary_pt', pr.summary_pt,
    'summary_en', pr.summary_en,
    'problem_pt', pr.problem_pt,
    'problem_en', pr.problem_en,
    'solution_pt', pr.solution_pt,
    'solution_en', pr.solution_en,
    'result_pt', pr.result_pt,
    'result_en', pr.result_en,
    'category', pr.category,
    'project_type', pr.project_type,
    'status', pr.status,
    'technologies', pr.technologies,
    'demo_url', pr.demo_url,
    'repository_url', pr.repository_url,
    'original_url', pr.original_url
  ) as data
from public.projects pr
where pr.is_published = true and pr.ai_visible = true

union all

-- Certifications: public metadata only, never the private file path.
select
  'certification' as entity_type,
  c.id as entity_id,
  jsonb_build_object(
    'title', c.title,
    'issuer', c.issuer,
    'category', c.category,
    'issue_date', c.issue_date,
    'expiration_date', c.expiration_date,
    'credential_code', c.credential_code,
    'credential_url', c.credential_url
  ) as data
from public.certifications c
where c.is_published = true and c.ai_visible = true

union all

select
  'experience' as entity_type,
  e.id as entity_id,
  jsonb_build_object(
    'company', e.company,
    'role_pt', e.role_pt,
    'role_en', e.role_en,
    'description_pt', e.description_pt,
    'description_en', e.description_en,
    'start_date', e.start_date,
    'end_date', e.end_date,
    'is_current', e.is_current,
    'skills', e.skills
  ) as data
from public.experiences e
where e.is_published = true and e.ai_visible = true

union all

-- Public technologies aggregated from published projects and experiences.
select
  'technology' as entity_type,
  gen_random_uuid() as entity_id,
  jsonb_build_object('name', tech.name) as data
from (
  select distinct unnest(pr.technologies) as name
  from public.projects pr
  where pr.is_published = true and pr.ai_visible = true
  union
  select distinct unnest(e.skills) as name
  from public.experiences e
  where e.is_published = true and e.ai_visible = true
) tech;

grant select on public.public_ai_knowledge to anon, authenticated;
