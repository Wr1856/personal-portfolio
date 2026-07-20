-- Storage buckets and object policies.
-- Public buckets serve branding assets, project covers, and the résumé.
-- The certificates bucket is private: only the admin can touch it.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'branding-public',
    'branding-public',
    true,
    5242880, -- 5 MB
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  ),
  (
    'project-covers-public',
    'project-covers-public',
    true,
    5242880, -- 5 MB
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  ),
  (
    'resumes-public',
    'resumes-public',
    true,
    8388608, -- 8 MB
    array['application/pdf']
  ),
  (
    'certificates-private',
    'certificates-private',
    false,
    15728640, -- 15 MB
    array['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/avif']
  )
on conflict (id) do nothing;

-- Public read for the public buckets.

create policy "public_buckets_read"
  on storage.objects for select
  using (
    bucket_id in ('branding-public', 'project-covers-public', 'resumes-public')
  );

-- Admin-only writes on every bucket.

create policy "admin_objects_insert"
  on storage.objects for insert
  with check (
    public.is_admin()
    and bucket_id in (
      'branding-public',
      'project-covers-public',
      'resumes-public',
      'certificates-private'
    )
  );

create policy "admin_objects_update"
  on storage.objects for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin_objects_delete"
  on storage.objects for delete
  using (public.is_admin());

-- Admin-only read for the private certificates bucket.

create policy "admin_private_certificates_read"
  on storage.objects for select
  using (bucket_id = 'certificates-private' and public.is_admin());
