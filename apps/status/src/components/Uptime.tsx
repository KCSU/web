import type { ComponentChildren } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import {
  API_URL, POLL_MS, TIMEOUT_MS, formatDate, formatUpdated, historyDates, isUp,
  type Site, type Uptime as UptimeData,
} from '../lib/uptime';

export default function Uptime() {
  const uptime = usePolledUptime();
  if (uptime === 'failed') {
    return (
      <Banner colour="bg-down">
        Status unavailable
        <small class="block text-[0.8rem] break-words opacity-85">
          {API_URL} is unreachable
        </small>
      </Banner>
    );
  }
  if (!uptime) return <Loading />;

  const dates = historyDates(new Date());
  const allUp = uptime.sites.every((site) => !site.latest || isUp(site));
  return (
    <>
      <Banner colour={allUp ? 'bg-up' : 'bg-down'}>
        {allUp ? 'All systems operational' : 'Some systems are down'}
        <small class="block text-[0.8rem] opacity-85">
          Last updated: {formatUpdated(uptime.updated_at)}
        </small>
      </Banner>
      {uptime.sites.map((site) => <SiteCard key={site.id} site={site} dates={dates} />)}
    </>
  );
}

/**
 * Fetches /api/uptime now, then every minute while the tab is visible.
 * `'failed'` only if nothing has loaded yet.
 */
function usePolledUptime(): UptimeData | 'failed' | null {
  const [uptime, setUptime] = useState<UptimeData | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let loading = false;
    const refresh = async () => {
      if (loading || document.hidden) return;
      loading = true;
      try {
        const response = await fetch(API_URL, { signal: AbortSignal.timeout(TIMEOUT_MS) });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        setUptime(await response.json() as UptimeData);
      } catch (err) {
        console.error('loading the status failed:', err);
        setFailed(true);
      } finally {
        loading = false;
      }
    };

    refresh();
    const timer = setInterval(refresh, POLL_MS);
    // Hidden tabs don't poll, and catch up as soon as they're shown.
    document.addEventListener('visibilitychange', refresh);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);

  return uptime ?? (failed ? 'failed' : null);
}

function Banner({ colour, children }: { colour: string; children: ComponentChildren }) {
  return <div class={`rounded-lg px-4 py-3 text-[20px] font-normal text-white ${colour}`}>{children}</div>;
}

/** How many placeholder cards to show while loading. */
const LOADING_SITES = 4;

/** Placeholder with the same layout as the loaded page. */
function Loading() {
  return (
    <>
      <Banner colour="bg-pending">
        Checking status…
        <small class="block text-[0.8rem] opacity-85">Loading the latest checks</small>
      </Banner>
      {Array.from({ length: LOADING_SITES }, (_, i) => (
        <section key={i} class="mt-4 rounded-lg bg-card p-4 motion-safe:animate-pulse" aria-hidden="true">
          <div class="flex justify-between gap-2">
            <Placeholder width="w-48" />
            <Placeholder width="w-24" />
          </div>
          <div class="mt-3 mb-1 h-8 rounded-xs bg-nodata" />
          <div class="text-[0.8rem]">&nbsp;</div>
        </section>
      ))}
    </>
  );
}

/** A grey block that takes up one line of text. */
function Placeholder({ width }: { width: string }) {
  return <span class={`inline-block rounded-xs bg-nodata leading-none ${width}`}>&nbsp;</span>;
}

function SiteCard({ site, dates }: { site: Site; dates: string[] }) {
  return (
    <section class="mt-4 rounded-lg bg-card p-4">
      <div class="flex flex-wrap justify-between gap-2">
        <a class="font-semibold hover:underline" href={site.url}>{site.name}</a>
        <SiteState site={site} />
      </div>
      <Bars site={site} dates={dates} />
      <div class="flex justify-between gap-2 text-[0.8rem] text-muted">
        <span>
          <span class="sm:hidden">50 days ago</span>
          <span class="hidden sm:inline">{dates.length} days ago</span>
        </span>
        <span>
          <span class="sm:hidden">{uptimeText(site, dates.slice(-50))}</span>
          <span class="hidden sm:inline">{uptimeText(site, dates)}</span>
        </span>
        <span>Today</span>
      </div>
    </section>
  );
}

/** The share of checks that passed over these dates, or nothing without data. */
function uptimeText(site: Site, dates: string[]): string {
  const days = dates.map((date) => site.days[date]).filter((day) => day?.total);
  const up = days.reduce((sum, day) => sum + day.up, 0);
  const total = days.reduce((sum, day) => sum + day.total, 0);
  return total ? `${((up / total) * 100).toFixed(2)}% uptime` : '';
}

function SiteState({ site }: { site: Site }) {
  if (!site.latest) return <span>No data</span>;
  return isUp(site)
    ? <span class="text-up">Operational</span>
    : <span class="text-down">Down ({site.latest.error})</span>;
}

/** Color-coded uptime bars. */
function Bars({ site, dates }: { site: Site; dates: string[] }) {
  return (
    <div class="mt-3 mb-1 flex h-8 gap-0.5 [&>span:nth-last-child(n+51)]:hidden sm:[&>span:nth-last-child(n+51)]:block">
      {dates.map((date) => {
        const day = site.days[date];
        if (!day?.total) {
          return <span key={date} class="flex-1 rounded-xs bg-nodata" title={`${formatDate(date)}: no data`} />;
        }
        const ratio = day.up / day.total;
        const colour = ratio >= 0.99 ? 'bg-up' : ratio >= 0.9 ? 'bg-partial' : 'bg-down';
        return (
          <span key={date} class={`flex-1 rounded-xs ${colour}`}
            title={`${formatDate(date)}: ${(ratio * 100).toFixed(1)}% up`} />
        );
      })}
    </div>
  );
}
