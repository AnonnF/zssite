-- Project Analyzer schema (v1)
-- Used by local import scripts via service role only.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  repo_url text,
  github_owner text,
  github_repo text,
  default_branch text,
  template_id text,
  status text not null default 'draft'
    check (status in ('draft', 'imported', 'analyzing', 'needs-review', 'published', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_slug_idx on public.projects (slug);

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row
  execute function public.set_updated_at();

create table if not exists public.repo_snapshots (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  source text not null default 'github',
  repo_url text not null,
  branch text,
  commit_sha text,
  tree_sha text,
  imported_at timestamptz not null default now(),
  file_count int not null default 0,
  included_file_count int not null default 0,
  skipped_file_count int not null default 0,
  snapshot_status text not null default 'imported',
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists repo_snapshots_project_id_idx on public.repo_snapshots (project_id);

create table if not exists public.project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  snapshot_id uuid not null references public.repo_snapshots (id) on delete cascade,
  path text not null,
  name text not null,
  type text not null check (type in ('file', 'folder')),
  language text,
  size_bytes int,
  github_blob_sha text,
  github_url text,
  raw_url text,
  is_too_large boolean not null default false,
  is_binary boolean not null default false,
  is_candidate boolean not null default false,
  score numeric,
  score_reasons jsonb not null default '[]'::jsonb,
  review_status text not null default 'generated',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (snapshot_id, path)
);

create index if not exists project_files_project_id_idx on public.project_files (project_id);
create index if not exists project_files_snapshot_id_idx on public.project_files (snapshot_id);
create index if not exists project_files_path_idx on public.project_files (path);

create table if not exists public.import_jobs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects (id) on delete set null,
  repo_url text not null,
  project_slug text,
  status text not null default 'pending'
    check (status in ('pending', 'running', 'completed', 'failed')),
  started_at timestamptz,
  finished_at timestamptz,
  error_message text,
  summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists import_jobs_status_idx on public.import_jobs (status);

create table if not exists public.ai_drafts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  snapshot_id uuid references public.repo_snapshots (id) on delete set null,
  provider text,
  model text,
  raw_json jsonb not null,
  selection_report jsonb not null default '{}'::jsonb,
  validation_report jsonb not null default '{}'::jsonb,
  warnings jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.review_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  target_type text not null,
  target_path text,
  action text not null,
  before_data jsonb,
  after_data jsonb,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.published_exports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  snapshot_id uuid references public.repo_snapshots (id) on delete set null,
  export_path text,
  version text,
  status text not null default 'published',
  published_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);
