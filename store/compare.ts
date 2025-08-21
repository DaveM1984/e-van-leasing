'use client';
import { create } from 'zustand';

type State = { ids: string[]; add: (id: string) => void; remove: (id: string) => void };
export const useCompareStore = create<State>((set) => ({
  ids: [],
  add: (id) => set((s) => (s.ids.length < 4 && !s.ids.includes(id) ? { ids: [...s.ids, id] } : s)),
  remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) }))
}));