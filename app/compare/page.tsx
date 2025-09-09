'use client';
import { useCompareStore } from '@/store/compare';
import { useEffect, useState } from 'react';

export default function ComparePage() {
  const ids = useCompareStore((s) => s.ids);
  const remove = useCompareStore((s) => s.remove);
  const [offers, setOffers] = useState<any[]>([]);

  useEffect(() => {
    let aborted = false;
    (async () => {
      // If nothing selected, clear table and skip fetch
      if (ids.length === 0) {
        setOffers([]);
        return;
      }

      const qs = ids.map((id) => `id=${encodeURIComponent(id)}`).join('&');
      const res = await fetch(`/api/search?${qs}`, { cache: 'no-store' });
      const data = await res.json();

      if (aborted) return;
      // Keep the same column order as the current selection
      const byId = new Map<string, any>(data.items.map((o: any) => [o.id, o]));
      const ordered = ids.map((id) => byId.get(id)).filter(Boolean);
      setOffers(ordered);
    })();
    return () => {
      aborted = true;
    };
  }, [ids]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Compare offers</h1>
      {offers.length === 0 ? (
        <p>Add up to 4 vans to compare.</p>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-[800px] border">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-2 text-left">Spec</th>
                {offers.map((o) => (
                  <th key={o.id} className="p-2 text-left">
                    <div className="flex items-center justify-between">
                      <span>{o.make} {o.model}</span>
                      <button
                        type="button"
                        className="text-sm underline"
                        onClick={() => remove(o.id)}
                        aria-label={`Remove ${o.make} ${o.model} from compare`}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="text-primary font-semibold">£{o.monthlyFromExVat.toFixed(2)}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Derivative', 'derivative'],
                ['Fuel', 'fuel'],
                ['Transmission', 'transmission'],
                ['Payload (kg)', 'payloadKg'],
                ['Load length (mm)', 'loadLengthMm'],
                ['Range (miles)', 'rangeMiles']
              ].map(([label, key]) => (
                <tr key={key as string}>
                  <td className="p-2 border-r font-medium">{label}</td>
                  {offers.map((o) => (
                    <td key={o.id + String(key)} className="p-2">{o[key as keyof typeof o] ?? '-'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}