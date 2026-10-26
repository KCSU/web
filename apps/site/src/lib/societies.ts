import { fetchApi } from './api';

export type Category = 'academic' | 'sports' | 'other';

export interface Contact {
  /** What the address is for, e.g. "President". Null for a plain contact address. */
  label: string | null;
  email: string;
}

export interface Society {
  id: string;
  name: string;
  category: Category;
  description: string | null;
  contacts: Contact[];
  photo_url: string | null;
  website: string | null;
  /** A handle, without the leading "@". */
  instagram: string | null;
  calendar: string | null;
}

interface SocietiesResponse {
  /** Unix seconds. */
  updated_at: number;
  /** In display order. */
  societies: Society[];
}

/** In display order. */
export const CATEGORIES: { id: Category; name: string }[] = [
  { id: 'academic', name: 'Academic' },
  { id: 'sports', name: 'Sports' },
  { id: 'other', name: 'Other' },
];

export function fetchSocieties(): Promise<SocietiesResponse> {
  return fetchApi<SocietiesResponse>('/societies');
}
