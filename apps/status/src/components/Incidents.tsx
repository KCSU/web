import { formatUpdateTime, type Notice } from '../lib/notices';
import type { Site } from '../lib/uptime';

/** An incident that hasn't ended. */
export function IncidentCard({ notice, sites, now }: { notice: Notice; sites: Site[]; now: number }) {
  const titleId = `notice-${notice.id}`;
  return (
    <section aria-labelledby={titleId} class="flex flex-col gap-2 border border-t-0 border-incident-border bg-incident-bg p-4 last:rounded-b-lg">
      <h2 id={titleId} class="text-[18px] leading-[1.3] font-semibold text-incident-fg">{notice.title}</h2>
      {notice.body && <p class="whitespace-pre-line">{notice.body}</p>}
      <Affects notice={notice} sites={sites} />
      {notice.updates.length > 0 && (
        <ol class="mt-1 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-2.5 border-t border-incident-border pt-3 text-[14px]">
          {[...notice.updates].reverse().map((update) => (
            <li key={update.at} class="col-span-2 grid grid-cols-subgrid">
              <time class="text-muted tabular-nums" dateTime={new Date(update.at * 1000).toISOString()}>
                {formatUpdateTime(update.at, now)}
              </time>
              <span class="whitespace-pre-line">{update.text}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function Affects({ notice, sites }: { notice: Notice; sites: Site[] }) {
  const affected = sites.filter((site) => notice.site_ids.includes(site.id));
  if (affected.length === 0) return null;
  return (
    <p class="text-[14px] opacity-75">
      Affects:{' '}
      {affected.map((site, i) => (
        <span key={site.id}>
          {i > 0 && ', '}
          <a class="underline" href={`#site-${site.id}`}>{site.name}</a>
        </span>
      ))}
    </p>
  );
}
