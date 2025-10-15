export type PriceSelection = {
  term: number;               // selected term in months
  mileage: number;            // selected annual mileage
  initial: number;            // selected initial multiple (x months)
  balloon?: number;           // selected balloon (ex-VAT)
  cashPriceExVat?: number;    // vehicle cash price ex-VAT (optional)
  baseTerm?: number;          // base term for the PDP "from" price
  baseMileage?: number;       // base mileage for the PDP "from" price
  baseInitial?: number;       // base initial multiple (reserved for future use)
  baseBalloon?: number;       // base balloon used for the PDP "from" price
};

/**
 * Calculate an estimated monthly price from a base monthly figure (the PDP "from" price)
 * by scaling for term, mileage and balloon. Where a cash price is available, we scale
 * linearly with (cashPrice - balloon)/term so that the base selection reproduces the
 * base monthly exactly. This is an illustrative model (not a quote).
 */
export function priceForSelection(baseMonthly: number, sel: PriceSelection): number {
  const baseTerm = sel.baseTerm ?? sel.term;
  const baseMileage = sel.baseMileage ?? sel.mileage;
  const baseBalloon = sel.baseBalloon ?? (sel.balloon ?? 0);

  const term = sel.term || baseTerm;
  const mileage = sel.mileage || baseMileage;
  const balloon = sel.balloon ?? baseBalloon;

  let monthly = baseMonthly;

  if (sel.cashPriceExVat && sel.cashPriceExVat > 0) {
    const cash = sel.cashPriceExVat;
    const financedBase = Math.max(1, cash - baseBalloon);
    const k = (baseMonthly * baseTerm) / financedBase; // ensures base selection returns baseMonthly
    const financedNow = Math.max(1, cash - balloon);
    monthly = k * (financedNow / Math.max(1, term));
  } else {
    // Fallback: proportional to term so base reproduces baseMonthly
    monthly = baseMonthly * (baseTerm / Math.max(1, term));
  }

  // Scale for mileage (simple linear factor)
  if (baseMileage > 0 && mileage > 0) {
    monthly = monthly * (mileage / baseMileage);
  }

  // Clamp & round
  monthly = Math.max(0, Number.isFinite(monthly) ? monthly : 0);
  return Math.round(monthly * 100) / 100;
}