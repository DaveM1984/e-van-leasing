import { filterOffers, parseFiltersFromSearchParams } from '@/lib/filters';
import data from '@/data/offers.json';

test('budget under 250', () => {
  const f = parseFiltersFromSearchParams({ budget: 'under-250' });
  const items = filterOffers(data as any, f);
  expect(items.every((i) => i.monthlyFromExVat < 250)).toBe(true);
});