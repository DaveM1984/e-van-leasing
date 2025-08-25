import { getOffers } from '@/lib/repositories/offers';
import { OfferGrid } from '@/components/OfferGrid';
import { Breadcrumbs } from '@/components/Breadcrumbs';
export const dynamic = 'force-dynamic';

export default async function MakePage({ params }: { params: { make: string } }) {
  const make = decodeURIComponent(params.make);
  const data = await getOffers({ filters: { make } });

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Breadcrumbs items={[{ name: 'Vans', href: '/vans' }, { name: make }]} />
      <h1 className="text-2xl font-semibold">{make} van leasing</h1>
      <p className="mt-2 text-slate-700">
        Explore {make} leasing offers available for fast delivery across the UK.
      </p>
      <OfferGrid offers={data.items} />
    </div>
  );
}