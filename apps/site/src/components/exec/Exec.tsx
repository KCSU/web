import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faArrowUp, faListUl, faTableCells, type IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'preact/hooks';

import { fetchExec, formatUpdated, holderNames, type Exec as ExecData, type Role } from '../../lib/exec';
import Icon from '../Icon';

type View = 'card' | 'table';

export default function Exec() {
  const exec = useExec();
  const [view, setView] = useView();

  return (
    <>
      <div class="flex justify-end mb-6">
        <div class="inline-flex items-center bg-gray-100 rounded-lg p-1 shadow-xs">
          <ViewButton view="card" current={view} onSelect={setView} icon={faTableCells} label="Cards" />
          <ViewButton view="table" current={view} onSelect={setView} icon={faListUl} label="Table" />
        </div>
      </div>

      {!exec ? <Loading /> : view === 'card' ? <Cards roles={exec.roles} /> : <Table roles={exec.roles} />}

      <div class="mt-16 pt-8 border-t border-gray-200 text-sm text-gray-500">
        <div class="flex items-center justify-between gap-4">
          <p>
            This page is subject to change. For any queries, please contact{' '}
            <a href="mailto:president@kcsu.org.uk" class="text-purple-700 hover:text-purple-900">the KCSU President</a>.
          </p>
          <a href="#" class="inline-flex flex-none items-center text-purple-600 hover:text-purple-800">
            Back to top
            <Icon icon={faArrowUp} class="ml-1" />
          </a>
        </div>
        {exec && <p class="mt-2">Last updated: {formatUpdated(exec.updated_at)}</p>}
      </div>
    </>
  );
}

function useExec(): ExecData | null {
  const [exec, setExec] = useState<ExecData | null>(null);
  useEffect(() => {
    fetchExec().then(setExec, (err) => console.error('loading the exec failed:', err));
  }, []);
  return exec;
}

function useView(): [View, (view: View) => void] {
  const [view, setView] = useState<View>('card');
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('view') === 'table') setView('table');
  }, []);

  const select = (next: View) => {
    setView(next);
    const url = new URL(window.location.href);
    url.searchParams.set('view', next);
    window.history.replaceState(null, '', url);
  };
  return [view, select];
}

interface ViewButtonProps {
  view: View;
  current: View;
  onSelect: (view: View) => void;
  icon: IconDefinition;
  label: string;
}

function ViewButton({ view, current, onSelect, icon, label }: ViewButtonProps) {
  const selected = view === current;
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(view)}
      class={`flex items-center px-4 py-2 rounded-md font-medium ${
        selected ? 'bg-white text-purple-800 shadow-xs' : 'text-gray-600 hover:text-gray-800'
      }`}
    >
      <Icon icon={icon} class="text-lg mr-2" />
      <span>{label}</span>
    </button>
  );
}

function Cards({ roles }: { roles: Role[] }) {
  return (
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      {roles.map((role) => <Card key={role.id} role={role} />)}
    </div>
  );
}

function Card({ role }: { role: Role }) {
  const names = holderNames(role);
  return (
    <article class="bg-white text-gray-900 rounded-xl shadow-md p-6 transition-shadow duration-300 hover:shadow-xl">
      <div class="flex gap-4 md:gap-8">
        <div class="grow min-w-0">
          <h2 class="text-2xl/7 font-bold">{role.title}</h2>
          {names && <p class={`text-lg/5 font-bold mt-1 ${role.photo_url ? 'md:hidden' : ''}`}>{names}</p>}
          <p class="text-gray-600 italic mt-1 mb-3 text-sm">
            {role.emails.map((email, i) => (
              <span key={email} class="inline-block">
                <a href={`mailto:${email}`} class="hover:text-purple-800">{email}</a>
                {i < role.emails.length - 1 && ', '}
              </span>
            ))}
          </p>
          {role.holders.length === 0
            ? <p class="text-sm italic text-gray-500">This position is currently vacant.</p>
            : role.bio && <p class="text-sm whitespace-pre-line">{role.bio}</p>}
        </div>
        {role.photo_url && (
          <figure class="flex-none text-center w-24 md:w-28 lg:w-32 mt-1">
            <img
              src={role.photo_url}
              alt={names || role.title}
              loading="lazy"
              class="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full object-cover"
            />
            {names && <figcaption class="hidden md:block mt-3 font-bold text-base/5">{names}</figcaption>}
          </figure>
        )}
      </div>
      {role.instagram.length > 0 && (
        <div class="flex flex-wrap gap-x-4 gap-y-1 mt-4">
          {role.instagram.map((handle) => (
            <a
              key={handle}
              href={`https://www.instagram.com/${handle}/`}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-purple-800 transition-colors"
            >
              <Icon icon={faInstagram} class="text-base" />
              <span>@{handle}</span>
            </a>
          ))}
        </div>
      )}
    </article>
  );
}

function Table({ roles }: { roles: Role[] }) {
  return (
    <div class="overflow-x-auto rounded-lg">
      <table class="min-w-full bg-white border border-gray-200">
        <thead>
          <tr class="bg-gray-300 text-gray-900 uppercase leading-normal">
            <th class="py-3 px-6 text-left">Name</th>
            <th class="py-3 px-6 text-left">Role</th>
            <th class="py-3 px-6 text-left">Email</th>
          </tr>
        </thead>
        <tbody class="text-gray-800 font-light">
          {roles.map((role) => (
            <tr key={role.id} class="border-b border-gray-200 hover:bg-gray-200 odd:bg-gray-100">
              <td class="py-3 px-6">{holderNames(role) || <em class="text-gray-500">Vacant</em>}</td>
              <td class="py-3 px-6">{role.title}</td>
              <td class="py-3 px-6">
                {role.emails.map((email, i) => (
                  <span key={email}>
                    <a href={`mailto:${email}`} class="text-purple-700 hover:text-purple-900">{email}</a>
                    {i < role.emails.length - 1 && ', '}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** How many placeholder cards to show while loading. */
const LOADING_ROLES = 6;

/** Placeholder with the same layout as the loaded cards. */
function Loading() {
  return (
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8" aria-busy="true">
      {Array.from({ length: LOADING_ROLES }, (_, i) => (
        <div key={i} class="flex gap-8 bg-white rounded-xl shadow-md p-6 motion-safe:animate-pulse" aria-hidden="true">
          <div class="grow space-y-3">
            <div class="h-7 w-40 rounded-sm bg-gray-200" />
            <div class="h-4 w-56 rounded-sm bg-gray-200" />
            <div class="h-16 rounded-sm bg-gray-200" />
          </div>
          <div class="flex-none w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-gray-200" />
        </div>
      ))}
    </div>
  );
}
