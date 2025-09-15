import Image from 'next/image';
import { getOffers, getOfferById, getVehicleImagesForOffer } from '@/lib/repositories/offers';
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

  const remoteImages = await getVehicleImagesForOffer(offer);
  const heroImage = remoteImages[0] || offer.images[0] || '/brand/e-van-leasing-logo.png';

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Breadcrumbs
        items={[
          { name: offer.make, href: `/vans/${encodeURIComponent(offer.make)}` },
          { name: offer.model, href: `/vans/${encodeURIComponent(offer.make)}/${encodeURIComponent(offer.model)}` },
          { name: offer.derivative }
        ]}
      />
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          {/* Simple gallery: native <img> for easy client-side swap, plus thumbnails */}
          <div className="rounded overflow-hidden bg-white">
            <div className="relative aspect-[4/3] bg-slate-100 border">
              <img
                id="pdp-main"
                src={heroImage}
                alt={`${offer.make} ${offer.model}`}
                className="object-contain w-full h-full"
                loading="eager"
              />
            </div>
            {(() => {
              const unique = Array.from(new Set([heroImage, ...remoteImages, ...(offer.images || [])])).slice(0, 8);
              return unique.length > 1 ? (
                <div className="mt-3 grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {unique.map((u, i) => (
                    <button
                      key={u + i}
                      type="button"
                      className="relative aspect-[4/3] border rounded overflow-hidden hover:ring"
                      data-src={u}
                      aria-label={`Show image ${i + 1}`}
                    >
                      <img src={u} alt="" className="object-cover w-full h-full" loading="lazy" />
                    </button>
                  ))}
                </div>
              ) : null;
            })()}
          </div>

          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(){
                  var main = document.getElementById('pdp-main');
                  if(!main) return;
                  var container = main.closest('div')?.parentElement;
                  if(!container) return;
                  container.addEventListener('click', function(e){
                    var btn = e.target.closest('button[data-src]');
                    if(!btn) return;
                    var src = btn.getAttribute('data-src');
                    if(src && main.getAttribute('src') !== src) {
                      main.setAttribute('src', src);
                    }
                  });
                })();
              `
            }}
          />
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
          <div id="enquiry" className="mt-6 scroll-mt-20">
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