import { FilterRail } from '@/components/FilterRail';
import { OfferGrid } from '@/components/OfferGrid';
import { getOffers } from '@/lib/repositories/offers';
import { parseFiltersFromSearchParams } from '@/lib/filters';

export const dynamic = 'force-dynamic';

export default async function VansPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const filters = parseFiltersFromSearchParams(searchParams);
  const page = Number(searchParams.page ?? 1);
  const pageSize = 12;
  const data = await getOffers({ filters, page, pageSize, sort: String(searchParams.sort || '') });

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 grid md:grid-cols-[260px_1fr] gap-6">
      <aside aria-label="Filters">
        <FilterRail />
      </aside>
      <section>
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-semibold">Browse all vans</h1>
          <SortSelect />
        </div>
        <OfferGrid offers={data.items} />
        <Pagination page={page} total={data.total} pageSize={pageSize} />
      </section>
    </div>
  );
}

function SortSelect() {
  return (
    <form action="/vans" className="ml-auto">
      <label className="sr-only" htmlFor="sort">Sort</label>
      <select id="sort" name="sort" className="border rounded p-2">
        <option value="">Sort: Default</option>
        <option value="price-asc">Price low → high</option>
        <option value="price-desc">Price high → low</option>
        <option value="delivery">Soonest delivery</option>
        <option value="newest">Newest</option>
      </select>
      <button className="ml-2 px-3 py-2 rounded bg-primary text-white">Apply</button>
    </form>
  );
}

function Pagination({ page, total, pageSize }: { page: number; total: number; pageSize: number }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <nav className="mt-6 flex gap-2" aria-label="Pagination">
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <a
          key={p}
          href={`/vans?page=${p}`}
          className={`px-3 py-2 rounded border ${p === page ? 'bg-slate-100 font-semibold' : ''}`}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </a>
      ))}
    </nav>
  );
}