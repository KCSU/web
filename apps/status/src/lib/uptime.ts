// Fetch and process data returned by admin API's /api/uptime.

/** A health check returned by /api/uptime. */
export interface Check {
  /** Unix seconds. */
  checked_at: number;
  status_code: number | null;
  latency_ms: number | null;
  /** `null` if the check passed. */
  error: string | null;
}

export interface Day {
  up: number;
  total: number;
}

export interface Site {
  id: string;
  name: string;
  url: string;
  latest: Check | null;
  outage_since: number | null;
  /** Keyed by UTC date, "YYYY-MM-DD". */
  days: Record<string, Day>;
}

export interface Uptime {
  updated_at: number;
  sites: Site[];
}

export const API_URL = 'https://admin.kcsu.org.uk/api/uptime';

export const POLL_MS = 60 * 1000;
export const TIMEOUT_MS = 30 * 1000;
const HISTORY_DAYS = 90;
const DAY_MS = 24 * 60 * 60 * 1000;

const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
});
const UPDATED_FORMAT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  hourCycle: 'h23', timeZone: 'Europe/London', timeZoneName: 'short',
});
const OFFSET_FORMAT = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/London', timeZoneName: 'shortOffset',
});

/** The last 90 UTC dates, oldest first, as "YYYY-MM-DD". */
export function historyDates(now: Date): string[] {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Array.from({ length: HISTORY_DAYS }, (_, i) =>
    new Date(today - (HISTORY_DAYS - 1 - i) * DAY_MS).toISOString().slice(0, 10));
}

/** "2026-09-24" as "24 Sept 2026". */
export function formatDate(date: string): string {
  return DATE_FORMAT.format(new Date(`${date}T00:00:00Z`));
}

/** Unix seconds as "1 Oct 2026, 12:34 BST (GMT+1)" or "1 Jan 2026, 12:34 GMT", in UK time. */
export function formatUpdated(unix: number): string {
  const at = new Date(unix * 1000);
  const text = UPDATED_FORMAT.format(at);
  const offset = OFFSET_FORMAT.formatToParts(at).find((part) => part.type === 'timeZoneName')?.value;
  // No timezone offset suffix when UK time is GMT.
  return !offset || /^GMT([+-]0)?$/.test(offset) ? text : `${text} (${offset})`;
}

/** Whether the site's latest check passed. */
export function isUp(site: Site): boolean {
  return site.latest !== null && site.latest.error === null;
}
