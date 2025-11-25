// lib/autotrader.ts

const BASE_URL =
  (process.env.AUTOTRADER_BASE_URL || 'https://api-sandbox.autotrader.co.uk').trim();
const KEY = process.env.AUTOTRADER_KEY ? process.env.AUTOTRADER_KEY.trim() : undefined;
const SECRET = process.env.AUTOTRADER_SECRET ? process.env.AUTOTRADER_SECRET.trim() : undefined;
const ADVERTISER_ID = process.env.AUTOTRADER_ADVERTISER_ID
  ? process.env.AUTOTRADER_ADVERTISER_ID.trim()
  : undefined;

// --- Types based on Auto Trader Stock API docs ---
export interface AutotraderStockItem {
  vehicle?: {
    make?: string;
    model?: string;
    derivative?: string;
    trim?: string | null;
    bodyType?: string | null;
    fuelType?: string | null;
    transmissionType?: string | null;
    payloadWeightKG?: number | null;
    lengthMM?: number | null;
    payloadLengthMM?: number | null;
    batteryRangeMiles?: number | null;
    standard?: {
      make?: string;
      model?: string;
      generation?: string | null;
      derivative?: string | null;
      bodyType?: string | null;
      fuelType?: string | null;
      transmissionType?: string | null;
    };
  };
  advertiser?: {
    advertiserId?: string;
    name?: string;
  };
  adverts?: {
    retailAdverts?: {
      priceOnApplication?: boolean;
      totalPrice?: { amountGBP?: number | null } | null;
      attentionGrabber?: string | null;
      description?: string | null;
      financeOffers?: {
        headlineOffer?: {
          product?: string;
          monthlyPayment?: { amountGBP?: number | null } | null;
          contractLengthMonths?: number | null;
          termMonths?: number | null;
          annualMileage?: number | null;
          optionalFinalPayment?: { amountGBP?: number | null } | null;
        } | null;
      } | null;
    } | null;
  };
  metadata?: {
    stockId?: string;
    lifecycleState?: string | null;
    dateOnForecourt?: string | null;
    lastUpdated?: string | null;
  };
  media?: {
    images?: { imageId?: string | null; href?: string | null }[];
  };
}

interface AutotraderStockResponse {
  results: AutotraderStockItem[];
  totalResults: number;
}

// --- Simple in-memory token cache ---
let cachedToken:
  | {
      token: string;
      expiresAt: number;
    }
  | null = null;

async function getAccessToken(): Promise<string> {
  if (!KEY || !SECRET) {
    throw new Error('AUTOTRADER_KEY or AUTOTRADER_SECRET missing');
  }

  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60_000) {
    return cachedToken.token;
  }

  // Auto Trader expects x-www-form-urlencoded body with key and secret only.
  const body = new URLSearchParams({
    key: KEY,
    secret: SECRET,
  });

  const res = await fetch(`${BASE_URL}/authenticate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Autotrader auth failed', res.status, text);
    throw new Error(`Autotrader auth failed: ${res.status}`);
  }

  const json = (await res.json()) as {
    access_token: string;
    expires_in?: number;
    expires_at?: string;
  };

  let expiresAt = now + 15 * 60 * 1000; // default 15 minutes
  if (json.expires_at) {
    const ts = Date.parse(json.expires_at);
    if (!Number.isNaN(ts)) {
      expiresAt = ts;
    }
  } else if (json.expires_in) {
    expiresAt = now + json.expires_in * 1000;
  }

  cachedToken = {
    token: json.access_token,
    expiresAt,
  };
  return json.access_token;
}

/**
 * Fetch all stock for the configured advertiser.
 * Uses a single call (Auto Trader supports paging, but most dealers won't need it initially).
 */
export async function fetchAutotraderStock(
  advertiserIdOverride?: string,
): Promise<AutotraderStockItem[]> {
  const advertiserId = advertiserIdOverride || ADVERTISER_ID;
  if (!advertiserId) {
    throw new Error('AUTOTRADER_ADVERTISER_ID missing');
  }

  const token = await getAccessToken();

  const url = new URL(`${BASE_URL}/stock`);
  url.searchParams.set('advertiserId', advertiserId);
  // Include valuations/finance/media if enabled on your account – names align with docs.
  url.searchParams.set('valuations', 'true');
  url.searchParams.set('financeOffers', 'true');
  // page & pageSize are available in the API; tweak as needed.
  url.searchParams.set('page', '1');
  url.searchParams.set('pageSize', '100');

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Autotrader stock fetch failed', res.status, text);
    throw new Error(`Autotrader stock fetch failed: ${res.status}`);
  }

  const json = (await res.json()) as AutotraderStockResponse;
  return json.results || [];
}

/**
 * Map an Auto Trader stock item into your internal Offer doc shape.
 * This is intentionally defensive: lots of fallbacks so it won't crash if fields are missing.
 */
export function mapAutotraderStockToOffer(
  s: AutotraderStockItem,
): Record<string, any> {
  const v = s.vehicle || {};
  const std = v.standard || {};
  const advertiser = s.advertiser || {};
  const retail = s.adverts?.retailAdverts || {};
  const headline = retail.financeOffers?.headlineOffer;

  const make = v.make || std.make || 'Unknown';
  const model = v.model || std.model || 'Unknown';
  const derivative =
    v.derivative || std.derivative || std.generation || v.trim || 'Van';

  const bodyType = v.bodyType || std.bodyType || 'Van';
  const fuel = v.fuelType || std.fuelType || 'Diesel';
  const transmission = v.transmissionType || std.transmissionType || 'Manual';

  const images =
    s.media?.images?.map((img) => img.href).filter(Boolean) ?? [];

  const lifecycle = (s.metadata?.lifecycleState || '').toUpperCase();
  const inStock = lifecycle === 'FORECOURT' || lifecycle === 'DUE_IN';

  const baseTerm = headline?.termMonths || headline?.contractLengthMonths || 48;
  const baseMileage = headline?.annualMileage || 10000;

  const monthlyIncVat = headline?.monthlyPayment?.amountGBP ?? null;
  const optionalFinalPayment = headline?.optionalFinalPayment?.amountGBP ?? 0;

  // Very simple VAT assumption — adjust if you know your finance feed is ex-VAT.
  const monthlyFromExVat = monthlyIncVat
    ? Number((monthlyIncVat / 1.2).toFixed(2))
    : 0;

  const balloonExVat = optionalFinalPayment
    ? Number((optionalFinalPayment / 1.2).toFixed(2))
    : 0;

  const headlineText =
    retail.attentionGrabber ||
    retail.description ||
    `${make} ${model} ${derivative}`.trim();

  // Map bodyType to your internal size buckets for filters.
  const size = mapBodyTypeToSize(bodyType);

  const payloadKg = v.payloadWeightKG ?? null;
  const loadLengthMm = v.payloadLengthMM ?? v.lengthMM ?? null;
  const rangeMiles = v.batteryRangeMiles ?? null;

  const stockId =
    s.metadata?.stockId ||
    `${make}-${model}-${derivative}`.toLowerCase().replace(/\s+/g, '-');

  const id = `autotrader-${stockId}`;

  return {
    id,
    source: 'autotrader',
    make,
    model,
    derivative,
    bodyType,
    size,
    fuel,
    transmission,
    payloadKg: payloadKg ?? undefined,
    loadLengthMm: loadLengthMm ?? undefined,
    rangeMiles: rangeMiles ?? undefined,
    inStock,
    deliveryEta: s.metadata?.dateOnForecourt || 'From Auto Trader',
    images,
    headline: headlineText,
    monthlyFromExVat: monthlyFromExVat || 0,
    // Feed some extra pricing info into your calculator model
    cashPriceExVat: retail.totalPrice?.amountGBP
      ? Number((retail.totalPrice.amountGBP / 1.2).toFixed(2))
      : undefined,
    balloonExVat: balloonExVat || undefined,
    baseTermMonths: baseTerm,
    baseMileage,
    baseInitialMultiple: 3,
    // Generic defaults so FinanceCalculator & Enquiry components keep working
    terms: {
      termMonths: [36, 48, 60],
      mileagesPerYear: [8000, 10000, 15000, 20000],
      initialPaymentMultiples: [1, 3, 6, 9, 12],
    },
    // Some useful metadata
    autotrader: {
      advertiserId: advertiser.advertiserId,
      advertiserName: advertiser.name,
      lifecycleState: s.metadata?.lifecycleState,
      lastUpdated: s.metadata?.lastUpdated,
    },
  };
}

function mapBodyTypeToSize(
  bodyType: string | null | undefined,
): 'Small' | 'Medium' | 'Large' | 'Pickup' {
  const bt = (bodyType || '').toLowerCase();
  if (bt.includes('pickup')) return 'Pickup';
  if (bt.includes('xl') || bt.includes('l4') || bt.includes('lwb')) return 'Large';
  if (bt.includes('small')) return 'Small';
  return 'Medium';
}