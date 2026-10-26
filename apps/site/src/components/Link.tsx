import type { ComponentChildren } from 'preact';

import { LINK } from '../lib/styles';

/** A link in page content. Links to other sites open in a new tab. */
export default function Link({ href, class: className = '', children }: {
  href: string;
  class?: string;
  children: ComponentChildren;
}) {
  const external = /^https?:/.test(href) && new URL(href).hostname !== 'kcsu.org.uk';
  return (
    <a
      href={href}
      class={className ? `${LINK} ${className}` : LINK}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  );
}
