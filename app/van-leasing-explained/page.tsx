export const metadata = { title: 'Van leasing explained' };

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Hero */}
      <header className="mb-8">
        <p className="text-sm tracking-wide uppercase text-primary font-semibold">Guides</p>
        <h1 className="mt-1 text-3xl md:text-4xl font-bold tracking-tight">Van leasing explained</h1>
        <p className="mt-3 text-slate-700 max-w-3xl">
          Here’s how business contract hire works – from monthly payments to mileage, maintenance and
          end-of-lease options. We’ve kept it simple and jargon‑free.
        </p>
      </header>

      {/* Quick facts */}
      <section className="grid md:grid-cols-3 gap-4">
        <Card title="Fixed monthly payments">
          Pay a fixed amount over 36–48 months. Road tax included; insurance & servicing separate unless you add maintenance.
        </Card>
        <Card title="Set your mileage">
          Choose from 8k–20k miles per year. You can change it before order – higher mileage usually lowers excess charges.
        </Card>
        <Card title="Return at the end">
          Hand the van back at the end of the term. No balloon payment and no worries about depreciation.
        </Card>
      </section>

      {/* How it works */}
      <section className="mt-10 grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold">How van leasing works</h2>
          <ol className="mt-3 space-y-2 text-slate-700 list-decimal pl-5 text-sm">
            <li>Pick a van and set your term (36/48 months), annual mileage and initial payment (1, 3, 6, 9 or 12 months).</li>
            <li>Credit check &amp; documents – we’ll guide you through and confirm delivery ETA.</li>
            <li>Delivery to your door. You pay your monthly rentals for the term.</li>
            <li>At the end, return the van in fair condition within mileage. Then start a new lease if you wish.</li>
          </ol>
        </div>
        <div className="border rounded p-5 bg-slate-50">
          <h3 className="text-lg font-semibold">Cost example (illustrative)</h3>
          <p className="mt-2 text-sm text-slate-700">
            If an offer is shown as <strong>£299.50 ex‑VAT</strong> per month on 36 months / 10k miles with a 9‑month initial payment:
          </p>
          <ul className="mt-3 text-sm space-y-1 list-disc pl-5 text-slate-700">
            <li>Initial payment: 9 × £299.50 = £2,695.50 ex‑VAT (collected once at the start).</li>
            <li>Monthly rentals: £299.50 ex‑VAT for the remaining months.</li>
            <li>Road tax included. Insurance &amp; servicing are your responsibility unless you add maintenance.</li>
          </ul>
          <p className="mt-3 text-xs text-slate-500">Figures are examples only. Actual pricing depends on funder terms and your credit profile.</p>
        </div>
      </section>

      {/* FAQs / details */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Frequently asked questions</h2>
        <div className="mt-4 space-y-3">
          <FAQ q="Is maintenance included?">
            Maintenance is optional. If you add it, servicing, routine wear items and breakdown cover are included per the plan.
          </FAQ>
          <FAQ q="Can I change the mileage later?">
            You can usually request a mileage amendment during the term (subject to funder approval). Changing mileage will adjust your monthly rental.
          </FAQ>
          <FAQ q="What if I go over the mileage?">
            You’ll pay an excess mileage charge shown on your agreement. If you expect higher usage, it’s cheaper to set a higher annual mileage upfront.
          </FAQ>
          <FAQ q="What counts as fair wear & tear?">
            End‑of‑lease inspections follow BVRLA fair wear & tear guidelines – light, age‑related marks are acceptable; accident damage is not.
          </FAQ>
          <FAQ q="Do prices include VAT?">
            Prices on our website are business lease rentals shown <strong>ex‑VAT</strong>. Personal pricing (inc‑VAT) can be provided on request.
          </FAQ>
        </div>
      </section>

      {/* CTA band */}
      <section className="mt-10 border rounded p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Ready to compare live offers?</h2>
          <p className="text-slate-700">Browse popular models and tailor term, mileage and initial payment.</p>
        </div>
        <div className="flex gap-2">
          <a href="/vans" className="px-4 py-2 rounded border">Browse vans</a>
          <a href="/contact" className="px-4 py-2 rounded bg-primary text-white">Talk to our team</a>
        </div>
      </section>

      {/* Small print */}
      <p className="mt-10 text-xs text-slate-500">E‑Van Leasing is a credit broker, not a lender. Finance subject to status. Excess mileage charges apply.</p>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border rounded p-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-slate-700">{children}</p>
    </div>
  );
}

function FAQ({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details className="border rounded p-4">
      <summary className="font-medium cursor-pointer select-none">{q}</summary>
      <div className="mt-2 text-sm text-slate-700">{children}</div>
    </details>
  );
}