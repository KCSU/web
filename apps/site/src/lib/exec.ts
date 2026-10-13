// Fetch the current exec from the admin API's /api/exec.

export interface Holder {
  name: string;
}

/** A role on the exec, which may be shared by several holders. */
export interface Role {
  id: string;
  title: string;
  emails: string[];
  holders: Holder[];
  bio: string | null;
  photo_url: string | null;
  /** Handles, without the leading "@". */
  instagram: string[];
}

export interface Exec {
  /** Unix seconds. */
  updated_at: number;
  /** In display order. */
  roles: Role[];
}

const API_URL = 'https://admin.kcsu.org.uk/api/exec';

const TIMEOUT_MS = 30 * 1000;

const UPDATED_FORMAT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/London',
});

export async function fetchExec(): Promise<Exec> {
  const response = await fetch(API_URL, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json() as Promise<Exec>;
}

/** Unix seconds as "13 October 2026", in UK time. */
export function formatUpdated(unix: number): string {
  return UPDATED_FORMAT.format(new Date(unix * 1000));
}

export function holderNames(role: Role): string {
  return role.holders.map((holder) => holder.name).join(', ');
}
