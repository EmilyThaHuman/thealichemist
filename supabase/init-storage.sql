-- Enable the storage extension if not already enabled
create extension if not exists "uuid-ossp";

-- Create storage buckets for projects
insert into storage.buckets (id, name, public) values 
  ('projects', 'projects', false);

-- Create policy for authenticated reads (signed URLs)
create policy "Authenticated Users Can Read"
  on storage.objects for select
  using (
    auth.role() = 'authenticated'
    and bucket_id = 'projects'
  );

-- Create policy for authenticated uploads
create policy "Authenticated Users Can Upload"
  on storage.objects for insert
  with check (
    auth.role() = 'authenticated'
    and bucket_id = 'projects'
    and (storage.foldername(name))[1] in (
      'BUENOS_AIRES',
      'FISHING_LODGE',
      'CHATEAU_MARMOT',
      'STUDIO',
      'SEATTLE_HOUSE',
      'CASA_MALIBU',
      'SAND_CASTLE',
      'ALI_WOOD',
      'FIT_TO_BE_TIED',
      'VW_VANS',
      'MOCHILAS'
    )
  );

-- Create policy for authenticated updates
create policy "Authenticated Users Can Update Own Files"
  on storage.objects for update
  using (
    auth.role() = 'authenticated'
    and bucket_id = 'projects'
    and (storage.foldername(name))[1] in (
      'BUENOS_AIRES',
      'FISHING_LODGE',
      'CHATEAU_MARMOT',
      'STUDIO',
      'SEATTLE_HOUSE',
      'CASA_MALIBU',
      'SAND_CASTLE',
      'ALI_WOOD',
      'FIT_TO_BE_TIED',
      'VW_VANS',
      'MOCHILAS'
    )
  );

-- Create policy for authenticated deletes
create policy "Authenticated Users Can Delete Own Files"
  on storage.objects for delete
  using (
    auth.role() = 'authenticated'
    and bucket_id = 'projects'
    and (storage.foldername(name))[1] in (
      'BUENOS_AIRES',
      'FISHING_LODGE',
      'CHATEAU_MARMOT',
      'STUDIO',
      'SEATTLE_HOUSE',
      'CASA_MALIBU',
      'SAND_CASTLE',
      'ALI_WOOD',
      'FIT_TO_BE_TIED',
      'VW_VANS',
      'MOCHILAS'
    )
  );

-- Enable RLS on storage.objects
alter table storage.objects enable row level security;