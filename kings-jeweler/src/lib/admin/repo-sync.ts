import "server-only";

/**
 * Model A content backup: after the client publishes an edit, mirror the
 * live overrides JSON into the Git repo as a versioned snapshot.
 *
 * Netlify Blobs stays the live source of truth — this commit is purely a
 * durable, diff-able backup so every content change is recorded in Git
 * history and recoverable. The committed file is NOT read at runtime, and the
 * commit message carries `[skip ci]` so it never triggers a redeploy.
 *
 * Entirely optional: when `GITHUB_TOKEN` is unset (local dev, preview
 * deploys, or if the feature is simply disabled) this is a graceful no-op and
 * publishing works exactly as before.
 *
 * Required env var:
 *   GITHUB_TOKEN          Fine-grained PAT (or GitHub App token) scoped to
 *                         this repo with `Contents: read & write`.
 * Optional env vars:
 *   GITHUB_CONTENT_REPO   "owner/name"  (default "Alloramedia/Kingsjeweler-website")
 *   GITHUB_CONTENT_PATH   path in repo  (default "kings-jeweler/content/overrides.json")
 *   GITHUB_CONTENT_BRANCH branch        (default "main")
 */

const GITHUB_API = "https://api.github.com";

interface RepoSyncConfig {
  token: string;
  repo: string;
  path: string;
  branch: string;
}

function getConfig(): RepoSyncConfig | null {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  return {
    token,
    repo: process.env.GITHUB_CONTENT_REPO || "Alloramedia/Kingsjeweler-website",
    // Path is relative to the REPO ROOT. The Next.js app lives in the
    // `kings-jeweler/` subdirectory, so the committed backup the app reads is at
    // `kings-jeweler/content/overrides.json` — not the repo root.
    path: process.env.GITHUB_CONTENT_PATH || "kings-jeweler/content/overrides.json",
    branch: process.env.GITHUB_CONTENT_BRANCH || "main",
  };
}

export interface RepoSyncResult {
  ok: boolean;
  /** True when no token is configured, so nothing was attempted. */
  skipped?: boolean;
  error?: string;
}

function githubHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "pitmasa-admin",
  };
}

/**
 * Commit the given overrides object to the repo. Resolves with `{ ok, skipped,
 * error }` and never throws — a backup failure must not break publishing.
 */
export async function syncOverridesToRepo(
  overrides: Record<string, unknown>,
): Promise<RepoSyncResult> {
  const cfg = getConfig();
  if (!cfg) return { ok: true, skipped: true };

  try {
    const contentsUrl = `${GITHUB_API}/repos/${cfg.repo}/contents/${cfg.path}`;
    const headers = githubHeaders(cfg.token);

    // Updating an existing file requires its current blob SHA. A 404 means the
    // file doesn't exist yet, so we create it (no SHA needed).
    let sha: string | undefined;
    const head = await fetch(
      `${contentsUrl}?ref=${encodeURIComponent(cfg.branch)}`,
      { headers, cache: "no-store" },
    );
    if (head.ok) {
      const data = (await head.json()) as { sha?: string };
      sha = data.sha;
    } else if (head.status !== 404) {
      const text = await head.text().catch(() => "");
      return { ok: false, error: `GitHub ${head.status}: ${text.slice(0, 200)}` };
    }

    const content = Buffer.from(
      `${JSON.stringify(overrides, null, 2)}\n`,
      "utf8",
    ).toString("base64");

    const res = await fetch(contentsUrl, {
      method: "PUT",
      headers,
      cache: "no-store",
      body: JSON.stringify({
        message: "chore(content): sync published site edits [skip ci]",
        content,
        branch: cfg.branch,
        ...(sha ? { sha } : {}),
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, error: `GitHub ${res.status}: ${text.slice(0, 200)}` };
    }

    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown repo-sync error",
    };
  }
}
