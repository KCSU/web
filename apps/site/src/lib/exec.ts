import { fetchApi } from './api';

export interface Holder {
  name: string;
}

/** A role on the exec, which may be shared by several holders. */
export interface Role {
  id: string;
  title: string;
  emails: string[];
  holders: Holder[];
  bio: string | null;
  photo_url: string | null;
  /** Handles, without the leading "@". */
  instagram: string[];
}

interface Exec {
  /** Unix seconds. */
  updated_at: number;
  /** In display order. */
  roles: Role[];
}

export function fetchExec(): Promise<Exec> {
  return fetchApi<Exec>('/exec');
}

export function holderNames(role: Role): string {
  return role.holders.map((holder) => holder.name).join(', ');
}
