import Image from 'next/image';
import { getHeroImageForOffer } from '@/lib/repositories/offers';

export async function DealCard({ offer }: { offer: any }) {
  const hero = await getHeroImageForOffer(offer);
  return (
    <a
      href={`/vans/${encodeURIComponent(offer.make)}/${encodeURIComponent(offer.model)}/${encodeURIComponent(offer.derivative)}`}
      className="block border rounded overflow-hidden hover:shadow focus:outline-none focus:ring-2 ring-offset-2"
    >
      <div className="relative aspect-[4/3] bg-slate-100">
        {offer.hotOffer && (
          <span className="absolute left-2 top-2 bg-primary text-white text-xs px-2 py-1 rounded">Hot</span>
        )}
        <Image
          src={hero}
          alt={`${offer.make} ${offer.model}`}
          fill
          sizes="(max-width:768px) 100vw, 33vw"
        />
      </div>
      <div className="p-3">
        <p className="font-medium">
          {offer.make} {offer.model}
        </p>
        <p className="text-sm text-slate-600 line-clamp-2">{offer.derivative}</p>
        <p className="mt-2 text-primary font-bold">
          £{offer.monthlyFromExVat.toFixed(2)}{' '}
          <span className="text-xs text-slate-600">ex-VAT</span>
        </p>
      </div>
    </a>
  );
}