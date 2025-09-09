export const metadata = {
  title: 'Van finance options',
  description:
    'Compare Finance Lease and Hire Purchase for vans — ownership, VAT, cash-flow, eligibility, and what affects monthly price.'
};

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Hero */}
      <header className="mb-8">
        <p className="text-sm tracking-wide uppercase text-primary font-semibold">Guides</p>
        <h1 className="mt-1 text-3xl md:text-4xl font-bold tracking-tight">Van finance options</h1>
        <p className="mt-3 text-slate-700 max-w-3xl">
          We typically arrange <strong>Finance Lease (FL)</strong> and <strong>Hire Purchase (HP)</strong> for business users.
          In short: <strong>HP = ownership at the end</strong>; <strong>FL = no transfer of ownership</strong> with VAT on each rental. If you need a deeper dive, see our
          {' '}<a className="underline text-primary" href="/van-leasing-explained">Van leasing explained</a> page.
        </p>
      </header>

      {/* Options at a glance */}
      <section className="grid md:grid-cols-2 gap-4">
        <OptionCard
          title="Finance Lease (FL)"
          bullets={[
            'Use the van for most of its life; legal title stays with the funder (lessor).',
            'VAT is charged on each rental — helpful for cash flow.*',
            'End of term: continue at a nominal rent or arrange a sale on the lessor’s behalf (per agreement).',
            'Optional balloon can reduce rentals — set sensibly with expected mileage.'
          ]}
        />
        <OptionCard
          title="Hire Purchase (HP)"
          bullets={[
            'Designed for eventual ownership after the final payment (and any option fee).',
            'VAT usually payable up-front on the purchase price; deposit typically required.*',
            'Asset and finance liability recognised on your balance sheet.**',
            'Good when you’ll keep the van long-term or need extensive modifications.'
          ]}
        />
      </section>

      {/* Comparison table */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold">FL vs HP — key differences</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-[760px] w-full text-sm border">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="p-3 border">Topic</th>
                <th className="p-3 border">Finance Lease (FL)</th>
                <th className="p-3 border">Hire Purchase (HP)</th>
              </tr>
            </thead>
            <tbody>
              <TR topic="Ownership" fl="No transfer — lessor keeps legal title." hp="Transfers to you after the final payment (and any option fee)." />
              <TR topic="VAT & cash flow*" fl="VAT on each rental — spreads VAT over the term." hp="VAT usually due up-front on the price; deposit typically required." />
              <TR topic="Balance sheet**" fl="Lessee capitalises asset + liability; records depreciation and interest." hp="Asset + liability recorded; you charge depreciation and interest." />
              <TR topic="End of term" fl="Continue at nominal rent or sell on lessor’s behalf and share proceeds per agreement." hp="You own the van outright." />
              <TR topic="Mileage & condition" fl="No mileage penalty in the contract itself, but mileage/condition affect resale proceeds." hp="You bear resale value risk; higher mileage may reduce value." />
              <TR topic="Payments pattern" fl="Initial rental multiple (e.g. 9x) then fixed rentals; optional final balloon can reduce rentals." hp="Deposit + fixed instalments over the term; no balloon required (some lenders may offer)." />
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          *VAT treatment varies by circumstance (e.g. your VAT status and how the van is used). Always confirm with your accountant.
          <br />
          **Accounting depends on your reporting framework (e.g. IFRS 16 or UK GAAP/FRS 102) and materiality. This is a general overview, not advice.
        </p>
      </section>

      {/* Eligibility & documents */}
      <section className="mt-10 grid md:grid-cols-3 gap-4">
        <InfoPanel title="Limited companies">
          <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
            <li>Trading history and filed accounts (or projections for newcos).</li>
            <li>Director/PSC details for credit checks and ID&V.</li>
            <li>Bank details for direct debit and affordability assessment.</li>
          </ul>
        </InfoPanel>
        <InfoPanel title="Sole traders & partnerships">
          <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
            <li>Bank statements and income evidence may be requested.</li>
            <li>Proof of identity and address for all applicants/partners.</li>
            <li>Business use confirmation for the vehicle.</li>
          </ul>
        </InfoPanel>
        <InfoPanel title="Individuals (personal use)">
          <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
            <li>Personal credit checks and affordability review.</li>
            <li>Proof of ID and address; employment/income details.</li>
            <li>Personal options available on request — ask our team.</li>
          </ul>
        </InfoPanel>
      </section>

      {/* What affects the monthly price */}
      <section className="mt-10 border rounded p-5">
        <h2 className="text-xl font-semibold">What affects your monthly price?</h2>
        <ul className="mt-2 text-sm text-slate-700 list-disc pl-5 space-y-1">
          <li><strong>Initial payment multiple</strong> (e.g. 1x, 3x, 6x, 9x, 12x) — higher initial usually lowers monthly.</li>
          <li><strong>Term length</strong> (30–60 months typical) and <strong>annual mileage</strong> (8k–20k+).</li>
          <li><strong>Maintenance package</strong> (optional) covering servicing, tyres and breakdown.</li>
          <li><strong>In‑stock vs factory order</strong>, lead time, and vehicle specification/options.</li>
          <li><strong>Credit profile</strong> and the funder’s current rate card/fees.</li>
        </ul>
        <p className="mt-2 text-xs text-slate-500">Figures shown on site are examples and may change without notice. They do not constitute an offer.</p>
      </section>

      {/* FAQs */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Finance FAQs</h2>
        <div className="mt-4 space-y-3">
          <FAQ q="Will there be a credit check?">
            Yes — the funder will perform credit and affordability checks. We’ll confirm the process and any required documentation before order.
          </FAQ>
          <FAQ q="Can I add maintenance?">
            Maintenance is optional on most quotes. If added, servicing, routine wear items and breakdown cover are typically included as per the plan.
          </FAQ>
          <FAQ q="Can I signwrite or fit racking?">
            Usually yes, provided changes are professional and reversible. Return standards and permissions vary by funder — ask us first.
          </FAQ>
          <FAQ q="Can I settle early?">
            Early settlement may be possible, but fees and charges can apply. We can request a settlement figure from the funder at any time.
          </FAQ>
          <FAQ q="Is insurance included?">
            No — you arrange fully‑comprehensive insurance for the vehicle for the duration of the agreement.
          </FAQ>
        </div>
      </section>

      {/* CTA band */}
      <section className="mt-10 border rounded p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Talk to our team</h2>
          <p className="text-slate-700">We’ll help you choose the right product, structure the deal, and secure live funder approvals.</p>
        </div>
        <div className="flex gap-2">
          <a href="/vans" className="px-4 py-2 rounded border">Browse vans</a>
          <a href="/contact" className="px-4 py-2 rounded bg-primary text-white">Get advice</a>
        </div>
      </section>

      {/* Small print */}
      <p className="mt-10 text-xs text-slate-500">
        E‑Van Leasing is a credit broker, not a lender. Finance subject to status. This page is for general guidance and
        does not constitute tax, accounting or financial advice. Please seek professional advice specific to your business.
      </p>
    </div>
  );
}

function OptionCard({ title, bullets }: { title: string; bullets: string[] }) {
  return (
    <div className="border rounded p-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      <ul className="mt-2 text-sm text-slate-700 list-disc pl-5 space-y-1">
        {bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

function InfoPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border rounded p-5">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function TR({ topic, fl, hp }: { topic: string; fl: string; hp: string }) {
  return (
    <tr>
      <td className="align-top p-3 border font-medium">{topic}</td>
      <td className="align-top p-3 border">{fl}</td>
      <td className="align-top p-3 border">{hp}</td>
    </tr>
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