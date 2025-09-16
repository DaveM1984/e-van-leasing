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
 * NOTE: Per API docs, this endpoint expects a JSON POST body.
 */
export async function fetchVehicleImagesJson(params: {
  idscode?: string;
  make?: string;
  model?: string;
  Year?: number;
  Commercial?: 0 | 1 | boolean;
  Body?: string;
  Vanbody?: string;
  Fuel?: string;
  Doors?: number;
  Type?: 'JPEG' | 'WebP' | 'Jpeg' | 'Webp' | string;
  keyword1?: string;
  keyword2?: string;
  keyword3?: string;
}): Promise<VehicleDetailsJson | null> {
  const token = await getImagesApiToken();
  const _debug = process.env.DEBUG_IMAGES === '1';

  // Normalise image type casing to the exact strings expected by the service
  const typeIn = String(params.Type || 'WebP');
  const type = /jpe?g/i.test(typeIn) ? 'Jpeg' : /webp/i.test(typeIn) ? 'WebP' : typeIn;

  // Build POST payload with only defined values
  const payload: Record<string, unknown> = {
    UserAuthTokenId: token,
    Type: type
  };

  const put = (k: string, v: unknown) => {
    if (typeof v !== 'undefined' && v !== null && v !== '') payload[k] = v;
  };

  put('idscode', params.idscode);
  put('make', params.make);
  put('model', params.model);
  put('Year', params.Year);

  if (typeof params.Commercial !== 'undefined') {
    const v = params.Commercial === true ? 1 : params.Commercial ? 1 : 0;
    put('Commercial', v);
  }

  // Prefer Vanbody for vans, but allow Body as a fallback
  put('Vanbody', params.Vanbody || params.Body);
  put('Body', params.Body);
  put('Fuel', params.Fuel);
  put('Doors', params.Doors);

  // The docs allow up to 3 keyword filters
  put('keyword1', params.keyword1);
  put('keyword2', params.keyword2);
  put('keyword3', params.keyword3);

  const res = await fetch(`${IMAGES_BASE}/VehicleImageSearch/Json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    if (_debug) {
      try {
        const safe = { ...payload, UserAuthTokenId: '[redacted]' };
        console.warn('[ImagesAPI] HTTP', res.status, 'payload=', JSON.stringify(safe).slice(0, 1000));
      } catch {}
    }
    if (res.status === 401) _cachedToken = null; // force re-auth on next call
    return null;
  }

  const data: VehicleDetailsJson = await res.json();

  if (data.ERRORMESSAGE) {
    if (_debug) {
      try {
        const safe = { ...payload, UserAuthTokenId: '[redacted]' };
        console.warn('[ImagesAPI] ERRORMESSAGE for payload', JSON.stringify(safe).slice(0, 1000), data.ERRORMESSAGE);
        console.warn('[ImagesAPI] RAW JSON', JSON.stringify(data).slice(0, 1000));
      } catch {}
    }
    return null;
  }

  return data;
}

// Clean an offer derivative into a concise keyword (e.g., "Limited", "Leader", "Trend")
// Not currently used in API calls (keywords can trigger WAF 403s), but kept for potential tuning.
function cleanDerivativeForKeywords(deriv?: string): string | undefined {
  if (!deriv) return undefined;
  let s = deriv;

  // Remove bracketed notes e.g. "(Black)" "(Magnetic)"
  s = s.replace(/\([^)]*\)/g, ' ');

  // Remove colours
  s = s.replace(/\b(black|white|magnetic|grey matter|grey|silver|blue|red|green|orange)\b/gi, ' ');

  // Remove wheelbase/roof and power figures
  s = s.replace(/\bL[0-3]\b/gi, ' ');
  s = s.replace(/\bH[0-3]\b/gi, ' ');
  s = s.replace(/\b\d{2,3}\s?ps\b/gi, ' ');

  // Remove transmission markers
  s = s.replace(/\b(Auto(matic)?|Manual)\b/gi, ' ');

  // Drop leading numeric series like "280", "320"
  s = s.replace(/^\s*\d{3}\b/, ' ');

  // Normalize whitespace
  s = s.replace(/\s+/g, ' ').trim();

  // Prefer recognisable trim names
  const parts = s.split(' ').filter(Boolean);
  const trims = ['Limited', 'Leader', 'Trend', 'Tekna', 'Premium', 'EcoBlue'];
  const hit = parts.find((p: string) => trims.includes(p));
  if (hit) return hit;

  return parts[0] || undefined;
}

/**
 * For a given offer, attempts to get best available image URLs from the API.
 * Tries multiple strategies (WebP/Jpeg, with/without keywords, Year hints) before giving up.
 * Returns an array of URLs in preferred order (hero first).
 */
export async function getVehicleImagesForOffer(offer: Offer): Promise<string[]> {
  const makeApi = String(offer.make || '').replace(/-/g, ' ');
  const _debug = process.env.DEBUG_IMAGES === '1';

  // Prefer richer hints to the API for tighter matches
  const idscode = (offer as any).idscode as string | undefined;
  const Body: string | undefined = typeof (offer as any).bodyType === 'string' ? (offer as any).bodyType : undefined;
  const Fuel: string | undefined = typeof (offer as any).fuel === 'string' ? (offer as any).fuel : undefined;

  // Build attempts in order: IDS code, plain make+model, then Vanbody/body/year hints, no keywords
  const attempts: Array<Parameters<typeof fetchVehicleImagesJson>[0]> = [
    // 0) If we have IDS code, try that alone first (fast path)
    ...(idscode
      ? [
          { idscode, Type: 'WebP' },
          { idscode, Type: 'Jpeg' }
        ]
      : []),

    // 1/2) Plain make+model (these are known to succeed consistently)
    { idscode, make: makeApi, model: offer.model, Commercial: true, Type: 'WebP', Fuel },
    { idscode, make: makeApi, model: offer.model, Commercial: true, Type: 'Jpeg', Fuel },

    // 3/4) Add body hint only (no keywords)
    ...(Body
      ? [
          { idscode, make: makeApi, model: offer.model, Commercial: true, Type: 'WebP', Vanbody: Body as string, Fuel },
          { idscode, make: makeApi, model: offer.model, Commercial: true, Type: 'Jpeg', Vanbody: Body as string, Fuel }
        ]
      : []),

    // 5–8) Year hints (kept last)
    ...(Body
      ? [
          { idscode, make: makeApi, model: offer.model, Commercial: true, Type: 'WebP', Vanbody: Body as string, Year: 2025, Fuel },
          { idscode, make: makeApi, model: offer.model, Commercial: true, Type: 'Jpeg', Vanbody: Body as string, Year: 2025, Fuel },
          { idscode, make: makeApi, model: offer.model, Commercial: true, Type: 'WebP', Vanbody: Body as string, Year: 2024, Fuel },
          { idscode, make: makeApi, model: offer.model, Commercial: true, Type: 'Jpeg', Vanbody: Body as string, Year: 2024, Fuel }
        ]
      : [])
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