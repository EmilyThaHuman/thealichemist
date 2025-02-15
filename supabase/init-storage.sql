-- Enable the storage extension if not already enabled
create extension if not exists "uuid-ossp";

-- Create storage buckets for projects
insert into storage.buckets (id, name, public) values 
  ('projects', 'projects', true);

-- Create project folders structure
DO $$
BEGIN
  -- Create base project paths
  EXECUTE format('
    INSERT INTO storage.objects (bucket_id, name, owner, metadata)
    VALUES 
      (''projects'', ''BUENOS_AIRES/'', auth.uid(), jsonb_build_object(''mimetype'', ''application/x-directory'')),
      (''projects'', ''FISHING_LODGE/'', auth.uid(), jsonb_build_object(''mimetype'', ''application/x-directory'')),
      (''projects'', ''CHATEAU_MARMOT/'', auth.uid(), jsonb_build_object(''mimetype'', ''application/x-directory'')),
      (''projects'', ''STUDIO/'', auth.uid(), jsonb_build_object(''mimetype'', ''application/x-directory'')),
      (''projects'', ''SEATTLE_HOUSE/'', auth.uid(), jsonb_build_object(''mimetype'', ''application/x-directory'')),
      (''projects'', ''CASA_MALIBU/'', auth.uid(), jsonb_build_object(''mimetype'', ''application/x-directory'')),
      (''projects'', ''SAND_CASTLE/'', auth.uid(), jsonb_build_object(''mimetype'', ''application/x-directory'')),
      (''projects'', ''ALI_WOOD/'', auth.uid(), jsonb_build_object(''mimetype'', ''application/x-directory'')),
      (''projects'', ''FIT_TO_BE_TIED/'', auth.uid(), jsonb_build_object(''mimetype'', ''application/x-directory'')),
      (''projects'', ''VW_VANS/'', auth.uid(), jsonb_build_object(''mimetype'', ''application/x-directory'')),
      (''projects'', ''MOCHILAS/'', auth.uid(), jsonb_build_object(''mimetype'', ''application/x-directory''))
  ');
END $$;

-- Create public access policy for the projects bucket
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'projects' );

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