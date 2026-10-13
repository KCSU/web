// Notices from /api/uptime: planned maintenance, incidents and general information.

export type NoticeKind = 'maintenance' | 'incident' | 'info';

export interface NoticeUpdate {
  /** Unix seconds. */
  at: number;
  text: string;
}

export interface Notice {
  id: string;
  kind: NoticeKind;
  title: string;
  body: string | null;
  /** The sites it affects. Empty means all of them. */
  site_ids: string[];
  /** Oldest first. */
  updates: NoticeUpdate[];
}

const DAY_FORMAT = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Europe/London',
});
const TIME_FORMAT = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'Europe/London',
});

const at = (unix: number) => new Date(unix * 1000);
const day = (unix: number) => DAY_FORMAT.format(at(unix));
const time = (unix: number) => TIME_FORMAT.format(at(unix));

/** Unix seconds as "14:12" if it's on the same UK day as `now`, else "Sat 18 Oct, 14:12",
 *  for a list of updates. */
export function formatUpdateTime(unix: number, now: number): string {
  return day(unix) === day(now) ? time(unix) : `${day(unix)}, ${time(unix)}`;
}
