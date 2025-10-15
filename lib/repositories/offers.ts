import data from '@/data/offers.json';
import { getDb } from '@/lib/db';
import { filterOffers, sortOffers } from '@/lib/filters';

export type Offer = (typeof data)[number] & {
  cashPriceExVat?: number;
  balloonExVat?: number;
  baseTermMonths?: number;
  baseMileage?: number;
  baseInitialMultiple?: number;
};

export async function getOffers({
  filters = {},
  page = 1,
  pageSize = 24,
  sort = '',
  limit,
  ids
}: {
  filters?: any;
  page?: number;
  pageSize?: number;
  sort?: string;
  limit?: number;
  ids?: string[];
}) {
  const db = await getDb();
  let items: Offer[] = [];
  if (db) {
    const coll = db.collection<Offer>('offers');
    const query: any = {};
    if (ids?.length) query.id = { $in: ids };
    // basic server filtering for Mongo path
    if (filters.make) query.make = filters.make;
    if (filters.model) query.model = filters.model;
    if (filters.bodyType) query.bodyType = filters.bodyType;
    if (filters.fuel) query.fuel = filters.fuel;
    if (filters.size) query.size = filters.size;
    if (filters.inStock != null) query.inStock = filters.inStock;
    items = await coll.find(query).toArray();
    // Fallback to static JSON if the database returns no items (e.g., empty collection)
    if (!items.length) {
      items = (ids?.length ? (data as Offer[]).filter((o) => ids!.includes(o.id)) : (data as Offer[]));
      items = filterOffers(items, filters);
    }
  } else {
    items = (ids?.length ? (data as Offer[]).filter((o) => ids!.includes(o.id)) : (data as Offer[]));
    items = filterOffers(items, filters);
  }

  items = sortOffers(items, sort);
  const total = items.length;
  if (limit) items = items.slice(0, limit);
  const offset = (page - 1) * pageSize;
  const paged = items.slice(offset, offset + pageSize);

  return { items: paged, total };
}

export async function getOfferById({ make, model, derivative }: { make: string; model: string; derivative: string }) {
  const all = (await getOffers({ pageSize: 9999 })).items;
  const norm = (s: string) => decodeURIComponent(String(s)).toLowerCase().replace(/\s+/g, ' ').trim();
  const makeN = norm(make);
  const modelN = norm(model);
  const derivN = norm(derivative);

  return all.find((o) =>
    norm(o.make) === makeN &&
    norm(o.model) === modelN &&
    norm(o.derivative) === derivN
  );
}

/* ---------- Tiny hero image cache (per-offer) ---------- */
const _heroImageCache = new Map<string, { url: string; expiresAt: number }>();
const HERO_TTL_MS = 10 * 60 * 1000; // 10 minutes
function _heroKey(o: Offer) {
  return `${String(o.make).toLowerCase()}|${String(o.model).toLowerCase()}|${String(o.derivative).toLowerCase()}`;
}

/* ---------- Images: use local/static only ---------- */

export async function getVehicleImagesForOffer(offer: Offer): Promise<string[]> {
  // Use whatever is in the offer record already
  const urls = Array.isArray((offer as any).images) ? (offer as any).images.filter(Boolean) : [];
  return urls;
}

export async function getHeroImageForOffer(offer: Offer): Promise<string> {
  const key = _heroKey(offer);
  const now = Date.now();
  const cached = _heroImageCache.get(key);
  if (cached && cached.expiresAt > now) return cached.url;

  const urls = await getVehicleImagesForOffer(offer);
  const hero = urls[0] || '/brand/e-van-leasing-logo.png';

  _heroImageCache.set(key, { url: hero, expiresAt: now + HERO_TTL_MS });
  return hero;
}