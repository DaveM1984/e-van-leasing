import { getOffers } from '@/lib/repositories/offers';
import { OfferGrid } from '@/components/OfferGrid';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default async function ModelPage({ params }: { params: { make: string; model: string } }) {
  const make = decodeURIComponent(params.make);
  const model = decodeURIComponent(params.model);
  const data = await getOffers({ filters: { make, model } });

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Breadcrumbs
        items={[
          { name: 'Vans', href: '/vans' },
          { name: make, href: `/vans/${encodeURIComponent(make)}` },
          { name: model }
        ]}
      />
      <h1 className="text-2xl font-semibold">
        {make} {model} leasing
      </h1>
      <OfferGrid offers={data.items} />
    </div>
  );
}