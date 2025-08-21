import { DealCard } from './DealCard';

export function OfferGrid({ offers, columns = 3 }: { offers: any[]; columns?: 1 | 2 | 3 | 4 }) {
  if (!offers?.length) return <p className="text-slate-600">No offers match your filters.</p>;

  const colClass =
    columns === 1 ? 'md:grid-cols-1' :
    columns === 2 ? 'md:grid-cols-2' :
    columns === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3';

  return (
    <div className={`grid gap-4 grid-cols-1 ${colClass}`}>
      {offers.map((o) => <DealCard key={o.id} offer={o} />)}
    </div>
  );
}