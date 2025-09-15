import data from '@/data/offers.json';
import { getDb } from '@/lib/db';
import { filterOffers, sortOffers } from '@/lib/filters';

export type Offer = (typeof data)[number];

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

/* ---------- Images API integration (Vehicle Validate) ---------- */

type ImagesApiAuthToken = {
  Id: string;
  ValidTo?: string;
};

type ImagesApiAuthResponse = {
  Result?: number;
  Message?: string | null;
  AuthToken?: ImagesApiAuthToken | null;
};

type VehicleDetailsJson = {
  VEHICLE_DETAILS?: {
    IDSCODE?: string;
    IMAGE_TYPE?: 'WEBP' | 'JPEG' | 'Jpeg' | 'WebP';
    IMAGE_URL?: string;
    DETAIL_IMAGE_URL?: string;
    BACK_IMAGE_URL?: string;
    INSIDE_IMAGE_URL?: string;
    SIDE_IMAGE_URL?: string;
  };
  ERRORMESSAGE?: string;
};

const IMAGES_BASE = 'https://vehiclevalidate-ws.azurewebsites.net';
let _cachedToken: { id: string; expiresAt: number } | null = null;

/**
 * Fetches and caches the Images API token.
 * Env: IMAGES_API_LOGIN_ID, IMAGES_API_PASSWORD
 */
export async function getImagesApiToken(): Promise<string> {
  const now = Date.now();
  if (_cachedToken && _cachedToken.expiresAt - now > 5 * 60 * 1000) {
    return _cachedToken.id;
  }

  const login = process.env.IMAGES_API_LOGIN_ID;
  const password = process.env.IMAGES_API_PASSWORD;
  if (!login || !password) {
    throw new Error('Images API credentials missing: set IMAGES_API_LOGIN_ID and IMAGES_API_PASSWORD');
  }

  const res = await fetch(`${IMAGES_BASE}/authentication`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ LoginId: login, Password: password })
  });

  if (!res.ok) {
    throw new Error(`Images API auth failed with HTTP ${res.status}`);
  }

  const data: ImagesApiAuthResponse = await res.json();

  if (data.Result !== 4 || !data.AuthToken?.Id) {
    throw new Error(`Images API auth error: ${data.Message || 'unknown'}`);
  }

  // Compute expiry (ValidTo or default to 11.5h from now to be safe)
  let expiresAt = now + 11.5 * 60 * 60 * 1000;
  if (data.AuthToken.ValidTo) {
    const t = Date.parse(data.AuthToken.ValidTo);
    if (!Number.isNaN(t)) {
      // refresh 15 minutes early
      expiresAt = t - 15 * 60 * 1000;
    }
  }

  _cachedToken = { id: data.AuthToken.Id, expiresAt };
  return _cachedToken.id;
}

/**
 * Calls the JSON image search endpoint.
 * Either provide idscode, or make & model (and optional Year/Commercial/body/vanbody).
 */
export async function fetchVehicleImagesJson(params: {
  idscode?: string;
  make?: string;
  model?: string;
  Year?: number;
  Commercial?: 0 | 1 | boolean;
  Body?: string;
  Vanbody?: string;
  Type?: 'jpeg' | 'webp';
  keyword1?: string;
  keyword2?: string;
  keyword3?: string;
}): Promise<VehicleDetailsJson | null> {
  const token = await getImagesApiToken();

  const payload: any = {
    UserAuthTokenId: token,
    Type: (params.Type || 'webp').toLowerCase(),
  };

  if (params.idscode) payload.idscode = params.idscode;
  if (params.make) payload.make = params.make;
  if (params.model) payload.model = params.model;
  if (params.Year) payload.Year = params.Year;
  if (params.Body) payload.Body = params.Body;
  if (params.Vanbody) payload.Vanbody = params.Vanbody;
  if (params.keyword1) payload.keyword1 = params.keyword1;
  if (params.keyword2) payload.keyword2 = params.keyword2;
  if (params.keyword3) payload.keyword3 = params.keyword3;

  if (typeof params.Commercial !== 'undefined') {
    payload.Commercial = params.Commercial === true ? 1 : params.Commercial ? 1 : 0;
  }

  const res = await fetch(`${IMAGES_BASE}/VehicleImageSearch/Json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    if (res.status === 401) _cachedToken = null;
    return null;
  }

  const data: VehicleDetailsJson = await res.json();
  if (data.ERRORMESSAGE) return null;

  return data;
}

/**
 * For a given offer, attempts to get best available image URLs from the API.
 * Adds IDS code and derivative/body/size keywords for tighter matches.
 * Returns an array of URLs in preferred order (hero first).
 */
export async function getVehicleImagesForOffer(offer: Offer): Promise<string[]> {
  try {
    const isCommercial = true; // our inventory is vans/pickups

    // Prefer richer hints to the API for tighter matches
    const idscode = (offer as any).idscode as string | undefined;
    const keyword1 = offer.derivative || undefined;
    const keyword2 = (offer as any).bodyType || undefined;
    const keyword3 = (offer as any).size || undefined;

    const data = await fetchVehicleImagesJson({
      idscode,
      make: offer.make,
      model: offer.model,
      Commercial: isCommercial ? 1 : 0,
      Type: 'webp',
      keyword1,
      keyword2,
      keyword3
    });

    const v = data?.VEHICLE_DETAILS;
    if (!v) return [];

    const ordered = [
      v.IMAGE_URL,
      v.DETAIL_IMAGE_URL,
      v.BACK_IMAGE_URL,
      v.INSIDE_IMAGE_URL,
      v.SIDE_IMAGE_URL
    ].filter((u): u is string => !!u);

    const seen = new Set<string>();
    const urls = ordered.filter((u) => {
      if (seen.has(u)) return false;
      seen.add(u);
      return true;
    });

    return urls;
  } catch {
    return [];
  }
}

/**
 * Returns a single best hero image URL for an offer, with a tiny in-memory cache (10m TTL).
 * Falls back to local image or placeholder.
 */
export async function getHeroImageForOffer(offer: Offer): Promise<string> {
  const key = _heroKey(offer);
  const now = Date.now();
  const cached = _heroImageCache.get(key);
  if (cached && cached.expiresAt > now) {
    return cached.url;
  }

  const remote = await getVehicleImagesForOffer(offer);
  const hero = remote[0] || offer.images?.[0] || '/brand/e-van-leasing-logo.png';

  _heroImageCache.set(key, { url: hero, expiresAt: now + HERO_TTL_MS });
  return hero;
}