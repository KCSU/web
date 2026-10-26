import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faTable, faTableCellsLarge, type IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Fragment } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { holderNames, type Role } from '../../lib/exec';
import { setUrlParam } from '../../lib/url';
import Icon from '../Icon';
import Link from '../Link';

type View = 'card' | 'table';

export default function Exec({ roles }: { roles: Role[] }) {
  const [view, setView] = useView();

  return (
    <>
      <div class="flex justify-end mb-6">
        <div class="inline-flex items-center bg-gray-100 rounded-lg p-1 shadow-xs">
          <ViewButton view="card" current={view} onSelect={setView} icon={faTableCellsLarge} label="Cards" />
          <ViewButton view="table" current={view} onSelect={setView} icon={faTable} label="Table" />
        </div>
      </div>

      {view === 'card' ? <Cards roles={roles} /> : <Table roles={roles} />}
    </>
  );
}

function useView(): [View, (view: View) => void] {
  const [view, setView] = useState<View>('card');
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('view') === 'table') setView('table');
  }, []);

  const select = (next: View) => {
    setView(next);
    setUrlParam('view', next);
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
    <article class="bg-white text-gray-900 rounded-xl border border-gray-300 p-6">
      <div class="flex gap-4 md:gap-8">
        <div class="grow min-w-0">
          <h2 class="text-2xl/7 font-bold">{role.title}</h2>
          {names && <p class={`text-lg/5 font-bold mt-1 ${role.photo_url ? 'md:hidden' : ''}`}>{names}</p>}
          <p class="mt-1 mb-3 text-sm">
            <Emails emails={role.emails} />
          </p>
          {role.holders.length === 0
            ? <p class="text-sm italic text-gray-500">This position is currently vacant.</p>
            : role.bio && <p class="text-base/6 whitespace-pre-line">{role.bio}</p>}
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
        <ul class="flex flex-wrap gap-x-4 mt-4 text-sm">
          {role.instagram.map((handle) => (
            <li key={handle} class="flex items-center gap-1.5">
              <Icon icon={faInstagram} class="flex-none text-base text-gray-500" />
              <Link href={`https://www.instagram.com/${encodeURIComponent(handle)}/`} class="leading-6">@{handle}</Link>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function Emails({ emails }: { emails: string[] }) {
  return (
    <>
      {emails.map((email, i) => (
        <Fragment key={email}>
          {i > 0 && ' '}
          <span class="inline-block">
            <Link href={`mailto:${email}`}>{email}</Link>
            {i < emails.length - 1 && ','}
          </span>
        </Fragment>
      ))}
    </>
  );
}

/** Rows stack on phones. */
function Table({ roles }: { roles: Role[] }) {
  return (
    <div class="rounded-xl border border-gray-300 overflow-hidden bg-white">
      <table class="w-full text-gray-900">
        <thead class="max-sm:sr-only">
          <tr class="bg-gray-50 border-b border-gray-300 text-sm">
            <th class="py-3 px-6 text-left font-semibold">Name</th>
            <th class="py-3 px-6 text-left font-semibold">Role</th>
            <th class="py-3 px-6 text-left font-semibold">Email</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id} class="border-b border-gray-200 last:border-b-0 max-sm:block max-sm:px-4 max-sm:py-3">
              <td class="py-3 px-6 max-sm:block max-sm:p-0 max-sm:font-semibold">
                {holderNames(role) || <em class="text-gray-500 font-normal">Vacant</em>}
              </td>
              <td class="py-3 px-6 max-sm:block max-sm:p-0 max-sm:text-sm max-sm:text-gray-600">{role.title}</td>
              <td class="py-3 px-6 max-sm:block max-sm:p-0 max-sm:mt-1 max-sm:text-sm">
                <Emails emails={role.emails} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
