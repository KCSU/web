import { overlaps, type Notice } from '../lib/notices';
import { formatDate, formatDuration, type Site } from '../lib/uptime';

const MINUTES_PER_CHECK = 10;
const DAY_SECONDS = 24 * 60 * 60;
const WIDTH = '16rem';

export function DayPopover({ site, date, notices, now, x }: {
  site: Site;
  date: string;
  notices: Notice[];
  now: number;
  x: number;
}) {
  const from = Date.parse(`${date}T00:00:00Z`) / 1000;
  const to = from + DAY_SECONDS;
  const related = notices.filter((notice) =>
    notice.kind !== 'info' && notice.site_ids.includes(site.id) && overlaps(notice, from, to, now));
  return (
    <>
      <div role="tooltip" style={{ width: WIDTH, left: `clamp(0px, ${x}px - ${WIDTH} / 2, 100% - ${WIDTH})` }}
        class="absolute top-full z-10 mt-2 rounded-lg border border-nodata bg-bg p-4 text-[14px] shadow-lg">
        <p class="font-semibold">{formatDate(date)}</p>
        <Downtime site={site} date={date} isToday={now < to} />
        {related.length > 0 && (
          <>
            <p class="mt-3 text-[12px] tracking-wide text-muted uppercase">Related</p>
            <ul class="mt-1 flex flex-col gap-1">
              {related.map((notice) => <li key={notice.id}>{notice.title}</li>)}
            </ul>
          </>
        )}
      </div>
      <span aria-hidden="true" style={{ left: `${x}px` }}
        class="absolute top-full z-10 mt-0.5 size-3 -translate-x-1/2 rotate-45 border-t border-l border-nodata bg-bg" />
    </>
  );
}

function Downtime({ site, date, isToday }: { site: Site; date: string; isToday: boolean }) {
  const day = site.days[date];
  if (!day?.total) return <p class="mt-2 text-muted">No data</p>;
  const failed = day.total - day.up;
  if (failed === 0) {
    return <p class="mt-2 text-muted">No downtime recorded{isToday ? ' so far' : ''}</p>;
  }
  return (
    <>
      <div class="mt-2 flex justify-between gap-2 rounded-md bg-card px-3 py-2">
        <span class="font-semibold">Down</span>
        <span class="tabular-nums">{formatDuration(failed * MINUTES_PER_CHECK)}</span>
      </div>
      <p class="mt-1.5 text-[12px] text-muted">
        {failed} of {day.total} checks failed{isToday ? ' so far today' : ''}
      </p>
    </>
  );
}
