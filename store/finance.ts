'use client';
import { create } from 'zustand';

type State = {
  term: number; mileage: number; initial: number;
  setTerm: (v: number) => void; setMileage: (v: number) => void; setInitial: (v: number) => void;
};

export const useFinanceStore = create<State>((set) => ({
  term: 36, mileage: 10000, initial: 9,
  setTerm: (v) => set({ term: v }),
  setMileage: (v) => set({ mileage: v }),
  setInitial: (v) => set({ initial: v })
}));