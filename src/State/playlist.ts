import { atomWithStorage } from 'jotai/utils';

export const playlistAtom = atomWithStorage<any>('playlist', null);