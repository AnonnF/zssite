import { getSupabaseAdmin } from "./supabaseAdmin.js";

export type SupabaseProjectRecord = {
  id: string;
  slug: string;
  title: string;
  status: string;
};

export type SupabaseSnapshotRecord = {
  id: string;
  project_id: string;
  commit_sha: string | null;
  imported_at: string;
};

export async function getProjectBySlug(
  slug: string
): Promise<SupabaseProjectRecord | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("projects")
    .select("id, slug, title, status")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load project "${slug}": ${error.message}`);
  }

  return data;
}

export async function getLatestSnapshotForProject(
  projectId: string
): Promise<SupabaseSnapshotRecord | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("repo_snapshots")
    .select("id, project_id, commit_sha, imported_at")
    .eq("project_id", projectId)
    .order("imported_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load latest snapshot: ${error.message}`);
  }

  return data;
}
