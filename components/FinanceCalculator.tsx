'use client';
import { useFinanceStore } from '@/store/finance';
import { priceForSelection } from '@/lib/pricing';

export function FinanceCalculator({ offer }: { offer: any }) {
  const { term, mileage, initial, setTerm, setMileage, setInitial } = useFinanceStore();

  const price = priceForSelection(offer.monthlyFromExVat, {
    term, mileage, initial
  });

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