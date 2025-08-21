import type { Offer } from './repositories/offers';

export function parseFiltersFromSearchParams(sp: Record<string, any>) {
  const f: any = {};
  if (sp.make) f.make = String(sp.make);
  if (sp.model) f.model = String(sp.model);
  if (sp.bodyType) f.bodyType = String(sp.bodyType);
  if (sp.fuel) f.fuel = String(sp.fuel);
  if (sp.size) f.size = String(sp.size);
  if (sp.inStock) f.inStock = sp.inStock === 'true';
  if (sp.budget) {
    const v = String(sp.budget);
    f.budget =
      v === 'under-250' ? [0, 249.99] : v === '250-350' ? [250, 350] : v === '350-plus' ? [350, Infinity] : null;
  }
  return f;
}

export function filterOffers(items: Offer[], f: any) {
  return items.filter((o) => {
    if (f.make && o.make !== f.make) return false;
    if (f.model && o.model !== f.model) return false;
    if (f.bodyType && o.bodyType !== f.bodyType) return false;
    if (f.fuel && o.fuel !== f.fuel) return false;
    if (f.size && o.size !== f.size) return false;
    if (typeof f.inStock === 'boolean' && o.inStock !== f.inStock) return false;
    if (f.budget) {
      const [min, max] = f.budget as [number, number];
      if (o.monthlyFromExVat < min || o.monthlyFromExVat > max) return false;
    }
    return true;
  });
}

export function sortOffers(items: Offer[], sort: string) {
  const arr = [...items];
  if (sort === 'price-asc') arr.sort((a, b) => a.monthlyFromExVat - b.monthlyFromExVat);
  if (sort === 'price-desc') arr.sort((a, b) => b.monthlyFromExVat - a.monthlyFromExVat);
  if (sort === 'delivery') arr.sort((a, b) => a.deliveryEta.localeCompare(b.deliveryEta));
  if (sort === 'newest') arr.sort((a, b) => b.id.localeCompare(a.id));
  return arr;
}