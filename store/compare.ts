'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type State = { ids: string[]; add: (id: string) => void; remove: (id: string) => void };

export const useCompareStore = create<State>()(
  persist(
    (set, get) => ({
      ids: [],
      add: (id) =>
        set((s) => (s.ids.length < 4 && !s.ids.includes(id) ? { ids: [...s.ids, id] } : s)),
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) }))
    }),
    {
      name: 'compare-ids',
      partialize: (s) => ({ ids: s.ids })
    }
  )
);