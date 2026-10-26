import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faCalendar, faEnvelope, faGlobe, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';

import { CATEGORIES, type Category, type Society } from '../../lib/societies';
import { LINK } from '../../lib/styles';
import { setUrlParam } from '../../lib/url';
import Icon from '../Icon';
import Link from '../Link';

const STICKY_TOP_PX = 80;

export default function Societies({ societies }: { societies: Society[] }) {
  const filter = useFilter(societies);
  const [marker, stuck] = useStuck();

  return (
    <div>
      <div ref={marker} />
      <div
        class={`sticky top-20 z-10 mx-3 sm:mx-6 mb-8 px-6 py-3 rounded-xl border border-gray-300 bg-white transition-shadow duration-200 ${
          stuck ? 'shadow-[0_0_24px_rgb(0_0_0/0.2)]' : ''
        }`}
      >
        <div class="flex flex-col sm:flex-row sm:items-center gap-3">
          <Chips filter={filter} />
          <Search filter={filter} />
        </div>
      </div>
      {filter.shown.length === 0 ? <NoResults filter={filter} /> : (
        <div class="columns-1 md:columns-2 xl:columns-3 gap-6">
          {filter.shown.map((society) => <Card key={society.id} society={society} />)}
        </div>
      )}
    </div>
  );
}

function Card({ society }: { society: Society }) {
  return (
    <article id={society.id} class="break-inside-avoid mb-6 bg-white text-gray-900 rounded-xl border border-gray-300 overflow-hidden scroll-mt-40">
      {society.photo_url && (
        <img src={society.photo_url} alt="" loading="lazy" decoding="async" class="w-full aspect-video object-cover" />
      )}
      <div class="p-6">
        <h2 class="text-lg/6 font-bold">{society.name}</h2>
        {society.description && <p class="text-base/6 text-gray-700 whitespace-pre-line mt-3">{society.description}</p>}
        <div class="mt-4 space-y-2 empty:hidden">
          <Links society={society} />
          <Contacts society={society} />
        </div>
      </div>
    </article>
  );
}

interface Filter {
  category: Category | null;
  query: string;
  setCategory: (category: Category | null) => void;
  setQuery: (query: string) => void;
  shown: Society[];
  counts: Record<Category | 'all', number>;
}

function useStuck() {
  const marker = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting && entry.boundingClientRect.top < STICKY_TOP_PX),
      { rootMargin: `-${STICKY_TOP_PX}px 0px 0px 0px` },
    );
    observer.observe(marker.current!);
    return () => observer.disconnect();
  }, []);
  return [marker, stuck] as const;
}

/** A category and search filter, kept in the URL as ?category=sports&q=... */
function useFilter(societies: Society[]): Filter {
  const [category, setCategoryState] = useState<Category | null>(null);
  const [query, setQueryState] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCategoryState(CATEGORIES.find((c) => c.id === params.get('category'))?.id ?? null);
    setQueryState(params.get('q') ?? '');
  }, []);

  const matching = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return societies.filter((s) => {
      const text = `${s.name} ${s.description ?? ''} ${s.instagram ?? ''}`.toLowerCase();
      return words.every((word) => text.includes(word));
    });
  }, [societies, query]);

  const counts = { all: matching.length, academic: 0, sports: 0, other: 0 };
  for (const s of matching) counts[s.category]++;

  return {
    category,
    query,
    setCategory: (next) => {
      setCategoryState(next);
      setUrlParam('category', next);
    },
    setQuery: (next) => {
      setQueryState(next);
      setUrlParam('q', next.trim() || null);
    },
    shown: category ? matching.filter((s) => s.category === category) : matching,
    counts,
  };
}

function Chips({ filter }: { filter: Filter }) {
  const options: { id: Category | null; label: string; count: number }[] = [
    { id: null, label: 'All', count: filter.counts.all },
    ...CATEGORIES.map((c) => ({ id: c.id, label: c.name, count: filter.counts[c.id] })),
  ];
  return (
    // One scrolling row on phones.
    <div role="group" aria-label="Category" class="grow flex gap-2 overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
      {options.map((option) => {
        const selected = filter.category === option.id;
        return (
          <button
            key={option.label}
            type="button"
            aria-pressed={selected}
            onClick={() => filter.setCategory(option.id)}
            class={`flex-none inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium border ${
              selected
                ? 'bg-primary border-primary text-white'
                : 'bg-white border-gray-300 text-gray-700 hover:border-purple-400 hover:text-purple-800'
            }`}
          >
            {option.label}
            <span class={`text-xs tabular-nums ${selected ? 'text-purple-200' : 'text-gray-500'}`}>{option.count}</span>
          </button>
        );
      })}
    </div>
  );
}

function Search({ filter }: { filter: Filter }) {
  return (
    <label class="relative block sm:w-64">
      <span class="sr-only">Search societies</span>
      <Icon icon={faMagnifyingGlass} class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="search"
        value={filter.query}
        onInput={(e) => filter.setQuery(e.currentTarget.value)}
        placeholder="Search societies"
        class="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
      />
    </label>
  );
}

function NoResults({ filter }: { filter: Filter }) {
  return (
    <div class="text-center py-16 text-gray-600">
      <p class="text-lg font-medium">No societies match “{filter.query}”.</p>
      <button
        type="button"
        onClick={() => { filter.setQuery(''); filter.setCategory(null); }}
        class={`mt-3 inline-flex items-center gap-1.5 min-h-6 ${LINK}`}
      >
        <Icon icon={faXmark} /> Clear the search
      </button>
    </div>
  );
}

function Links({ society }: { society: Society }) {
  const links = [
    society.website && { href: society.website, icon: faGlobe, label: 'Website' },
    society.instagram && {
      href: `https://www.instagram.com/${encodeURIComponent(society.instagram)}/`,
      icon: faInstagram,
      label: `@${society.instagram}`,
    },
    society.calendar && { href: society.calendar, icon: faCalendar, label: 'Calendar' },
  ].filter((link) => !!link);
  if (links.length === 0) return null;

  return (
    <ul class="flex flex-wrap gap-x-4 text-sm">
      {links.map((link) => (
        <li key={link.href} class="flex items-center gap-1.5">
          <Icon icon={link.icon} class="flex-none text-base text-gray-500" />
          <Link href={link.href} class="leading-6">{link.label}</Link>
        </li>
      ))}
    </ul>
  );
}

function Contacts({ society }: { society: Society }) {
  if (society.contacts.length === 0) return null;
  return (
    <ul class="text-sm">
      {society.contacts.map((contact) => (
        <li key={contact.email} class="flex items-center gap-1.5 min-w-0">
          <Icon icon={faEnvelope} class="flex-none text-base text-gray-500" />
          {contact.label && <span class="text-gray-600">{contact.label}:</span>}
          <Link href={`mailto:${contact.email}`} class="leading-6 truncate">{contact.email}</Link>
        </li>
      ))}
    </ul>
  );
}
