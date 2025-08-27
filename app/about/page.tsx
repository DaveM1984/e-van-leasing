export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Hero */}
      <header className="mb-10">
        <p className="text-sm tracking-wide uppercase text-primary font-semibold">About us</p>
        <h1 className="mt-1 text-3xl md:text-4xl font-bold tracking-tight">Straightforward van leasing from a UK-based team</h1>
        <p className="mt-3 text-slate-700 max-w-3xl">
          E‑Van Leasing is a specialist broker focused on clear pricing, quick delivery and friendly support. 
          We help sole traders and businesses find the right van and the right finance — without hidden fees.
        </p>
      </header>

      {/* Why trust us / pillars */}
      <section className="grid md:grid-cols-3 gap-4">
        <div className="border rounded p-5">
          <h2 className="text-lg font-semibold">Fair, transparent pricing</h2>
          <p className="mt-2 text-sm text-slate-700">No admin fees. Road tax included. Prices shown are business contract hire ex‑VAT.</p>
        </div>
        <div className="border rounded p-5">
          <h2 className="text-lg font-semibold">Fast UK delivery</h2>
          <p className="mt-2 text-sm text-slate-700">In‑stock and pipeline vans with clear ETAs so you can plan ahead.</p>
        </div>
        <div className="border rounded p-5">
          <h2 className="text-lg font-semibold">Personal service</h2>
          <p className="mt-2 text-sm text-slate-700">Talk to real people. We’ll guide you on makes, models, specs and finance options.</p>
        </div>
      </section>

      {/* Stats strip */}
      <section className="mt-8 grid sm:grid-cols-3 gap-4">
        <Stat label="UK customers served" value="2,000+" />
        <Stat label="Vans to compare" value="100+" />
        <Stat label="Average delivery ETA" value="8–12 weeks" />
      </section>

      {/* Story */}
      <section className="mt-10 grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold">Our story</h2>
          <p className="mt-2 text-slate-700">
            We started E‑Van Leasing to make van finance simpler. That means clear pricing, sensible specs
            and honest lead times. Whether you need a small city van or a large panel van, we’ll help you
            balance budget, payload and delivery.
          </p>
          <p className="mt-2 text-slate-700">
            We’re a credit broker, not a lender — so our job is to find you the best fit from multiple funders
            and manufacturers, then handle the paperwork while you get on with running your business.
          </p>
        </div>
        <div className="border rounded p-5 bg-slate-50">
          <h3 className="text-lg font-semibold">What we promise</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700 list-disc pl-5">
            <li>Clear, ex‑VAT pricing with no admin fees</li>
            <li>Options for 36 or 48 months, 8k–20k miles</li>
            <li>Advice on payload, towing and load space</li>
            <li>Up‑front delivery estimates and regular updates</li>
          </ul>
        </div>
      </section>

      {/* CTA band */}
      <section className="mt-10 border rounded p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Ready to find your next van?</h2>
          <p className="text-slate-700">Compare live prices and delivery across popular models.</p>
        </div>
        <div className="flex gap-2">
          <a href="/vans" className="px-4 py-2 rounded border">Browse vans</a>
          <a href="/contact" className="px-4 py-2 rounded bg-primary text-white">Talk to our team</a>
        </div>
      </section>

      {/* Small print */}
      <p className="mt-10 text-xs text-slate-500">E‑Van Leasing is a credit broker, not a lender.</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border rounded p-5 text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-slate-600">{label}</div>
    </div>
  );
}