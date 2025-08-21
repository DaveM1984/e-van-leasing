import { OfferGrid } from '@/components/OfferGrid';
import { getOffers } from '@/lib/repositories/offers';
import { parseFiltersFromSearchParams } from '@/lib/filters';

export default async function EVPage({
  searchParams
}: {
  searchParams?: Record<string, string | string[]>;
}) {
  const sp = { ...(searchParams || {}), fuel: 'Electric' };

  const { items } = await getOffers({
    filters: parseFiltersFromSearchParams(sp as Record<string, string>),
    page: Number((sp as any).page) || 1,
    pageSize: 24,
    sort: (sp as any).sort || ''
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Electric &amp; Hybrid Vans</h1>
      <OfferGrid offers={items} />
    </div>
  );
}