export function priceForSelection(base: number, sel: { term: number; mileage: number; initial: number }) {
  // Simple multipliers to simulate pricing changes
  const termAdj = sel.term === 48 ? 0.95 : 1; // longer term slightly cheaper
  const mileageAdj = sel.mileage > 10000 ? 1 + (sel.mileage - 10000) / 100000 : 1;
  const initialAdj = sel.initial >= 9 ? 0.98 : sel.initial <= 3 ? 1.03 : 1;
  return base * termAdj * mileageAdj * initialAdj;
}