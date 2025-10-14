'use client';
import { useFinanceStore } from '@/store/finance';
import { priceForSelection } from '@/lib/pricing';
import type { Offer } from '@/lib/repositories/offers';
import { useEffect } from 'react';

export function FinanceCalculator({ offer }: { offer: Offer }) {
  const { term, mileage, initial, setTerm, setMileage, setInitial } = useFinanceStore();

  // Initialise with baseTermMonths/baseMileage/baseInitialMultiple if present
  useEffect(() => {
    const terms: number[] = Array.isArray(offer?.terms?.termMonths)
      ? (offer.terms.termMonths as number[])
      : [];
    const mileages: number[] = Array.isArray(offer?.terms?.mileagesPerYear)
      ? (offer.terms.mileagesPerYear as number[])
      : [];
    const initials: number[] = Array.isArray(offer?.terms?.initialPaymentMultiples)
      ? (offer.terms.initialPaymentMultiples as number[])
      : [];

    const baseTerm = Number(offer?.baseTermMonths) || undefined;
    const baseMileage = Number(offer?.baseMileage) || undefined;
    const baseInitial = Number(offer?.baseInitialMultiple) || undefined;

    const prefTerm =
      (baseTerm && terms.includes(baseTerm) && baseTerm) ||
      (terms.includes(60) ? 60 : (terms.length ? Math.max(...terms) : term));

    const prefMileage =
      (baseMileage && mileages.includes(baseMileage) && baseMileage) ||
      (mileages.includes(10000) ? 10000
        : (mileages.length ? Math.min(...mileages) : mileage));

    const prefInitial =
      (baseInitial && initials.includes(baseInitial) && baseInitial) ||
      (initials.includes(3) ? 3
        : (initials.length
            ? [...initials].sort((a: number, b: number) => a - b)[Math.floor((initials.length - 1) / 2)]
            : initial));

    setTerm(prefTerm);
    setMileage(prefMileage);
    setInitial(prefInitial);
    // eslint-disable-next-line
  }, [offer]);

  const price = priceForSelection(offer.monthlyFromExVat, {
    term, mileage, initial
  });
  const profile = `${initial}+${Math.max(0, (term ?? 0) - 1)}`;

  return (
    <div className="grid gap-3">
      <Row label="Term">
        <select className="input" value={term} onChange={(e)=>setTerm(Number(e.target.value))}>
          {offer.terms.termMonths.map((t: number) => <option key={t} value={t}>{t} months</option>)}
        </select>
      </Row>
      <Row label="Mileage">
        <select className="input" value={mileage} onChange={(e)=>setMileage(Number(e.target.value))}>
          {offer.terms.mileagesPerYear.map((m: number) => <option key={m} value={m}>{m.toLocaleString()} miles</option>)}
        </select>
      </Row>
      <Row label="Initial payment">
        <select className="input" value={initial} onChange={(e)=>setInitial(Number(e.target.value))}>
          {offer.terms.initialPaymentMultiples.map((x: number) => <option key={x} value={x}>{x}x monthly</option>)}
        </select>
      </Row>
      <div className="mt-2 text-lg">
        Estimated monthly: <strong className="text-primary">£{price.toFixed(2)} ex-VAT</strong>
      </div>
      <div className="text-xs text-slate-500">
        Profile: {profile} ({term} months) · {mileage.toLocaleString()} miles/year
      </div>
      <style jsx>{`.input{@apply border rounded px-3 py-2 w-full;}`}</style>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-medium">{label}</span>
      {children}
    </label>
  );
}