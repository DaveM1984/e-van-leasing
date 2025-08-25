import Image from 'next/image';
import { getOffers, getOfferById } from '@/lib/repositories/offers';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FinanceCalculator } from '@/components/FinanceCalculator';
import { StickyCTA } from '@/components/StickyCTA';
import { CompareTray } from '@/components/CompareTray';
import Enquiry from './parts/Enquiry';
export const dynamic = 'force-dynamic';

export default async function PDP({
  params
}: {
  params: { make: string; model: string; derivative: string };
}) {
  const offer = await getOfferById(params);
  if (!offer) return <div className="mx-auto max-w-6xl p-6">Offer not found.</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Breadcrumbs
        items={[
          { name: 'Vans', href: '/vans' },
          { name: offer.make, href: `/vans/${offer.make}` },
          { name: offer.model, href: `/vans/${offer.make}/${offer.model}` },
          { name: offer.derivative }
        ]}
      />
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="relative aspect-[4/3] rounded overflow-hidden bg-slate-100">
            <Image
              src={offer.images[0] || '/vans/placeholder.jpg'}
              alt={`${offer.make} ${offer.model}`}
              fill
              sizes="(max-width:768px) 100vw, 50vw"
            />
          </div>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-700">
            {offer.payloadKg && <li><strong>Payload:</strong> {offer.payloadKg} kg</li>}
            {offer.loadLengthMm && <li><strong>Load length:</strong> {offer.loadLengthMm} mm</li>}
            <li><strong>Fuel:</strong> {offer.fuel}</li>
            <li><strong>Transmission:</strong> {offer.transmission}</li>
            <li><strong>In stock:</strong> {offer.inStock ? 'Yes' : 'No'}</li>
            <li><strong>ETA:</strong> {offer.deliveryEta}</li>
          </ul>
        </div>
        <div>
          <h1 className="text-2xl font-semibold">
            {offer.make} {offer.model} – {offer.derivative}
          </h1>
          <p className="mt-1 text-primary text-xl font-bold">From £{offer.monthlyFromExVat.toFixed(2)} ex-VAT / month</p>
          <p className="text-slate-600 mt-2">{offer.headline}</p>
          <div className="mt-6 border rounded p-4">
            <FinanceCalculator offer={offer} />
          </div>
          <div className="mt-6">
            <Enquiry offer={offer} />
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Images for illustration. Subject to status. Prices ex-VAT. Excess mileage charges apply.
            E-Van Leasing is a credit broker, not a lender.
          </p>
        </div>
      </div>
      <CompareTray offer={offer} />
      <StickyCTA price={offer.monthlyFromExVat} />
    </div>
  );
}