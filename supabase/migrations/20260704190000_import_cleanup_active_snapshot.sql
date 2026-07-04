-- Import cleanup: aborted jobs + active snapshot tracking

alter table public.import_jobs
  drop constraint if exists import_jobs_status_check;

alter table public.import_jobs
  add constraint import_jobs_status_check
  check (status in ('pending', 'running', 'completed', 'failed', 'aborted'));

alter table public.repo_snapshots
  add column if not exists active boolean not null default false,
  add column if not exists job_id uuid references public.import_jobs (id) on delete set null;

create index if not exists repo_snapshots_active_idx
  on public.repo_snapshots (project_id, active)
  where active = true;

create index if not exists repo_snapshots_commit_sha_idx
  on public.repo_snapshots (project_id, commit_sha);
