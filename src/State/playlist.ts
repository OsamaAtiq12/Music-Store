import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";

export const playlistAtom = atomWithStorage<any>("playlist", null);

export const likedTracksAtom = atom<any>([]);

export const dislikedTracksAtom = atom<any>([]);

export const skippedTracksAtom = atom<any>([]);

export const currentTrackAtom = atom<any>(null);
