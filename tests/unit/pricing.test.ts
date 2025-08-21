import { priceForSelection } from '@/lib/pricing';

test('longer term is cheaper', () => {
  const p36 = priceForSelection(300, { term: 36, mileage: 10000, initial: 9 });
  const p48 = priceForSelection(300, { term: 48, mileage: 10000, initial: 9 });
  expect(p48).toBeLessThan(p36);
});