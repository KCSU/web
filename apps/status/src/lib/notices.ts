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
  /** The sites it affects. Can be empty. */
  site_ids: string[];
  /** Unix seconds. Hidden until then. `null` if it has no set start. */
  starts_at?: number | null;
  /** Unix seconds. Hidden from then on. `null` if it has no set end. */
  ends_at?: number | null;
  /** Oldest first. */
  updates: NoticeUpdate[];
}

export type NoticeStatus = 'upcoming' | 'active' | 'ended';

export function noticeStatus(notice: Notice, now: number): NoticeStatus {
  if (notice.ends_at != null && now >= notice.ends_at) return 'ended';
  if (notice.starts_at != null && now < notice.starts_at) return 'upcoming';
  return 'active';
}

/** Whether the notice overlaps the half-open interval [`from`, `to`) (Unix seconds). */
export function overlaps(notice: Notice, from: number, to: number, now: number): boolean {
  const start = notice.starts_at ?? notice.updates[0]?.at ?? now;
  const end = notice.ends_at ?? now;
  return start < to && end >= from;
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
