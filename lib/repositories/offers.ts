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
  Type?: 'JPEG' | 'WebP' | 'Jpeg' | 'Webp' | string;
  keyword1?: string;
  keyword2?: string;
  keyword3?: string;
}): Promise<VehicleDetailsJson | null> {
  const token = await getImagesApiToken();

  // Enable debug logging if DEBUG_IMAGES=1
  const _debug = process.env.DEBUG_IMAGES === '1';

  // Build querystring; service expects GET with these params.
  const qs = new URLSearchParams();
  qs.set('UserAuthTokenId', token);
  // Per docs the service expects "Jpeg" or "WebP" casing
  qs.set('Type', (params.Type ? params.Type : 'WebP'));

  if (params.idscode) qs.set('idscode', String(params.idscode));
  if (params.make) qs.set('make', String(params.make));
  if (params.model) qs.set('model', String(params.model));
  if (params.Year) qs.set('Year', String(params.Year));
  if (typeof params.Commercial !== 'undefined') {
    const v = params.Commercial === true ? 1 : params.Commercial ? 1 : 0;
    qs.set('Commercial', String(v));
  }
  if (params.Body) qs.set('Body', String(params.Body));
  if (params.Vanbody) qs.set('Vanbody', String(params.Vanbody));
  if (params.keyword1) qs.set('keyword1', String(params.keyword1));
  if (params.keyword2) qs.set('keyword2', String(params.keyword2));
  if (params.keyword3) qs.set('keyword3', String(params.keyword3));

  const url = `${IMAGES_BASE}/VehicleImageSearch/Json?${qs.toString()}`;
  const res = await fetch(url, { method: 'GET' });

  if (!res.ok) {
    if (_debug) {
      try {
        const safeUrl = url.replace(/(UserAuthTokenId=)[^&]+/, '$1[redacted]');
        const bodyText = await res.text();
        console.warn('[ImagesAPI] HTTP', res.status, safeUrl, 'body=', bodyText.slice(0, 500));
      } catch {}
    }
    if (res.status === 401) _cachedToken = null;
    return null;
  }

  const data: VehicleDetailsJson = await res.json();
  if (data.ERRORMESSAGE) {
    if (_debug) {
      try {
        const safeUrl = url.replace(/(UserAuthTokenId=)[^&]+/, '$1[redacted]');
        console.warn('[ImagesAPI] ERRORMESSAGE for', safeUrl, data.ERRORMESSAGE);
      } catch {}
    }
    return null;
  }

  return data;
}
function cleanDerivativeForKeywords(deriv?: string): string | undefined {
  if (!deriv) return undefined;
  // Remove bracketed notes e.g. "(Black)" "(Magnetic)"
  let s = deriv.replace(/\([^)]*\)/g, ' ');
  // Remove common colour words that don’t help matching
  s = s.replace(/\b(black|white|magnetic|grey matter|grey|silver|blue|red|green|orange)\b/gi, ' ');
  // Collapse spaces
  s = s.replace(/\s+/g, ' ').trim();
  return s || undefined;
}

/**
 * For a given offer, attempts to get best available image URLs from the API.
 * Tries multiple strategies (WebP/Jpeg, with/without keywords, Year hints) before giving up.
 * Returns an array of URLs in preferred order (hero first).
 */
export async function getVehicleImagesForOffer(offer: Offer): Promise<string[]> {
  const isCommercial = true; // our inventory is vans/pickups
  const _debug = process.env.DEBUG_IMAGES === '1';

  // Prefer richer hints to the API for tighter matches
  const idscode = (offer as any).idscode as string | undefined;
  const keyword1Full = cleanDerivativeForKeywords(offer.derivative);
  const keyword2 = (offer as any).bodyType || undefined;
  const keyword3 = (offer as any).size || undefined;
  const Body = (offer as any).bodyType || undefined;

  // Build attempts in decreasing specificity
  const attempts: Array<Parameters<typeof fetchVehicleImagesJson>[0]> = [
    // 1) WebP with all hints
    { idscode, make: offer.make, model: offer.model, Commercial: 1, Type: 'WebP', Body, keyword1: keyword1Full, keyword2, keyword3 },
    // 2) JPEG with all hints
    { idscode, make: offer.make, model: offer.model, Commercial: 1, Type: 'Jpeg', Body, keyword1: keyword1Full, keyword2, keyword3 },
    // 3) WebP without detailed keywords (just make/model/body)
    { idscode, make: offer.make, model: offer.model, Commercial: 1, Type: 'WebP', Body },
    // 4) JPEG without detailed keywords
    { idscode, make: offer.make, model: offer.model, Commercial: 1, Type: 'Jpeg', Body },
    // 5) WebP + Year 2025 (new shape bias)
    { idscode, make: offer.make, model: offer.model, Commercial: 1, Type: 'WebP', Body, Year: 2025 },
    // 6) JPEG + Year 2025
    { idscode, make: offer.make, model: offer.model, Commercial: 1, Type: 'Jpeg', Body, Year: 2025 },
    // 7) WebP + Year 2024
    { idscode, make: offer.make, model: offer.model, Commercial: 1, Type: 'WebP', Body, Year: 2024 },
    // 8) JPEG + Year 2024
    { idscode, make: offer.make, model: offer.model, Commercial: 1, Type: 'Jpeg', Body, Year: 2024 }
  ];

  for (let i = 0; i < attempts.length; i++) {
    try {
      const a = attempts[i];
      const data = await fetchVehicleImagesJson(a);
      const v = data?.VEHICLE_DETAILS;
      if (!v) {
        if (_debug) {
          try {
            const safe = { ...a };
            if ('idscode' in safe) safe.idscode = (safe.idscode ? '[present]' : undefined) as any;
            console.info('[ImagesAPI] attempt', i + 1, 'no VEHICLE_DETAILS', JSON.stringify(safe));
          } catch {}
        }
        continue;
      }

      const ordered = [
        v.IMAGE_URL,
        v.DETAIL_IMAGE_URL,
        v.BACK_IMAGE_URL,
        v.INSIDE_IMAGE_URL,
        v.SIDE_IMAGE_URL
      ].filter((u): u is string => !!u);

      if (ordered.length) {
        const seen = new Set<string>();
        const urls = ordered.filter((u) => {
          if (seen.has(u)) return false;
          seen.add(u);
          return true;
        });

        if (_debug) {
          try {
            console.info('[ImagesAPI] attempt', i + 1, 'SUCCESS urls=', urls.slice(0, 3));
          } catch {}
        }

        return urls;
      }
    } catch (e) {
      if (_debug) {
        try {
          console.warn('[ImagesAPI] attempt', i + 1, 'threw', (e as Error)?.message);
        } catch {}
      }
      // keep trying fallbacks
    }
  }

  // Nothing worked
  return [];
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