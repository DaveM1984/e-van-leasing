import { SearchBar } from '@/components/SearchBar';
import { OfferGrid } from '@/components/OfferGrid';
import { TrustBadges } from '@/components/TrustBadges';
import { FAQAccordion } from '@/components/FAQAccordion';
import { LogoCloud } from '@/components/LogoCloud';
import { getOffers } from '@/lib/repositories/offers';

export default async function HomePage() {
  const { items } = await getOffers({ page: 1, pageSize: 100 });
  const small = items.filter((o) => o.size === 'Small').slice(0, 4);
  const medium = items.filter((o) => o.size === 'Medium').slice(0, 4);
  const large = items.filter((o) => o.size === 'Large').slice(0, 4);
  const ev = items.filter((o) => o.fuel === 'Electric').slice(0, 4);
  const pickups = items.filter((o) => o.size === 'Pickup').slice(0, 4);

  return (
    <div>
      <section className="bg-slate-50 border-b">
        <div className="mx-auto max-w-6xl px-4 py-10 lg:py-16">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Van leasing made simple — with fair, UK-ready pricing.
          </h1>
          <p className="mt-2 text-slate-600">
            Road tax included, no admin fees, and fast delivery options.
          </p>
          <div className="mt-6">
            <SearchBar />
          </div>
          <TrustBadges className="mt-6" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl font-semibold mb-4">Deal of the month</h2>
        <OfferGrid offers={items.filter((o) => o.hotOffer).slice(0, 1)} columns={1} />
      </section>

      <Section title="Small Vans" href="/vans?size=Small" offers={small} />
      <Section title="Medium Vans" href="/vans?size=Medium" offers={medium} />
      <Section title="Large Vans" href="/vans?size=Large" offers={large} />
      <Section title="Electric & Hybrid" href="/electric-vans" offers={ev} />
      <Section title="Pickups" href="/pickups" offers={pickups} />

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold">How van finance works</h2>
            <p className="mt-2 text-slate-700">
              Pick your term (usually 36 or 48 months), annual mileage, and initial rental (1–12×). Most of our business deals are <strong>Finance Lease</strong> — VAT is paid on each rental and legal ownership doesn’t transfer at the end. <strong>Hire Purchase</strong> is also available if you want to own the van once all payments are made. Prices shown are ex‑VAT for business users. Subject to status. E‑Van Leasing is a credit broker, not a lender. <a href="/van-leasing-explained" className="underline text-primary">Learn more</a>.
            </p>
          </div>
          <FAQAccordion
            items={[
              {
                q: 'Are prices ex-VAT?',
                a: 'Yes — all business lease prices are shown ex-VAT unless stated.'
              },
              {
                q: 'Is delivery included?',
                a: 'UK mainland delivery is usually included. We will confirm before order.'
              },
              {
                q: 'Can I change my mileage?',
                a: 'Yes — select from 8k to 20k miles per year on the offer page.'
              }
            ]}
          />
        </div>
      </section>
      <LogoCloud className="mx-auto max-w-6xl px-4 pb-16" />
    </div>
  );
}

function Section({
  title,
  href,
  offers
}: {
  title: string;
  href: string;
  offers: any[];
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-end justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <a className="text-primary hover:underline" href={href} aria-label={`View all ${title}`}>
          View all
        </a>
      </div>
      <OfferGrid offers={offers} />
    </section>
  );
}