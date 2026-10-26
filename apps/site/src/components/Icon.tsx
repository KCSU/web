import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface Props {
  icon: IconDefinition;
  fixedWidth?: boolean;
  class?: string;
}

export default function Icon({ icon, fixedWidth = false, class: className = '' }: Props) {
  const [width, height, , , path] = icon.icon;
  return (
    <svg
      class={`inline-block h-[1em] overflow-visible align-[-0.125em] ${fixedWidth ? 'w-[1.25em]' : 'w-auto'} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      fill="currentColor"
      aria-hidden="true"
    >
      {(Array.isArray(path) ? path : [path]).map((d) => <path key={d} d={d} />)}
    </svg>
  );
}
