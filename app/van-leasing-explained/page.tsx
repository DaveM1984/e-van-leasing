export const metadata = {
  title: 'Van leasing explained',
  description:
    'Clear differences between Hire Purchase and Finance Lease — ownership, VAT and cash‑flow, end‑of‑term options, accounting basics, BVRLA fair wear & tear, and worked examples.'
};

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Hero */}
      <header className="mb-8">
        <p className="text-sm tracking-wide uppercase text-primary font-semibold">Guides</p>
        <h1 className="mt-1 text-3xl md:text-4xl font-bold tracking-tight">Van leasing explained</h1>
        <p className="mt-3 text-slate-700 max-w-3xl">
          Two popular ways to fund a van are <strong>Hire Purchase (HP)</strong> and <strong>Finance Lease (FL)</strong>.
          In short: <strong>HP = you own the van at the end</strong>; <strong>FL = you never take ownership</strong>
          (you rent it for most of its life and may continue at a nominal rent or sell on the lessor’s behalf).
        </p>
      </header>

      {/* At a glance */}
      <section className="grid md:grid-cols-2 gap-4">
        <AtGlance
          title="Hire Purchase (HP) — ownership at the end"
          points={[
            'Asset is intended to be owned by you once the agreement is settled (often with a small option fee).',
            'VAT is usually due up‑front on the purchase price; a deposit is typically required.*',
            'Recorded on your balance sheet: you recognise the asset and the finance liability.**'
          ]}
        />
        <AtGlance
          title="Finance Lease (FL) — no transfer of ownership"
          points={[
            'Lessor keeps legal title; you have the right to use the van.',
            'VAT is paid on each rental rather than up‑front.*',
            'For lessees, a finance lease is capitalised (asset + liability); you record depreciation and interest.**'
          ]}
        />
      </section>

      {/* Comparison table */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold">HP vs Finance Lease — key differences</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-[720px] w-full text-sm border">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="p-3 border">Topic</th>
                <th className="p-3 border">Hire Purchase (HP)</th>
                <th className="p-3 border">Finance Lease (FL)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="align-top p-3 border font-medium">Ownership</td>
                <td className="align-top p-3 border">Ownership transfers to you at the end after the final payment (and any option fee).</td>
                <td className="align-top p-3 border">Lessor retains legal title for the full term. You may continue renting at a nominal rent or arrange a sale on the lessor’s behalf.</td>
              </tr>
              <tr className="bg-slate-50/40">
                <td className="align-top p-3 border font-medium">Balance sheet</td>
                <td className="align-top p-3 border">Asset and corresponding liability recognised by you; you charge depreciation and interest.**</td>
                <td className="align-top p-3 border">Finance leases are capitalised by the lessee (asset + liability). You recognise depreciation and interest.**</td>
              </tr>
              <tr>
                <td className="align-top p-3 border font-medium">Risk &amp; rewards</td>
                <td className="align-top p-3 border">Risks/rewards of ownership pass to you over the term; default can result in repossession.</td>
                <td className="align-top p-3 border">You bear most risks of use (maintenance, insurance, obsolescence) although legal title stays with the lessor.</td>
              </tr>
              <tr className="bg-slate-50/40">
                <td className="align-top p-3 border font-medium">Duration &amp; payments</td>
                <td className="align-top p-3 border">Typically 2–5 years with fixed monthly payments. Ownership transfers on settlement.</td>
                <td className="align-top p-3 border">Covers most of the useful life. End‑of‑term: continue at nominal rent or sell and share proceeds with the lessor (per agreement).</td>
              </tr>
              <tr>
                <td className="align-top p-3 border font-medium">VAT &amp; cash flow*</td>
                <td className="align-top p-3 border">VAT typically payable up‑front on the purchase price; deposit often required — larger initial outlay.</td>
                <td className="align-top p-3 border">VAT charged on each rental — spreads VAT over the term and can improve cash flow. Rentals can be reduced by setting a final (balloon) payment.</td>
              </tr>
              <tr className="bg-slate-50/40">
                <td className="align-top p-3 border font-medium">Mileage &amp; resale</td>
                <td className="align-top p-3 border">You own the van at the end, so resale value is yours. Higher mileage generally reduces that value.</td>
                <td className="align-top p-3 border">No mileage penalty in the contract itself, but if you’re selling on the lessor’s behalf, mileage/condition will affect the sale price and any proceeds share.</td>
              </tr>
              <tr>
                <td className="align-top p-3 border font-medium">Common use cases</td>
                <td className="align-top p-3 border">Ideal when you want ownership and plan to keep the van long‑term, or customise it heavily.</td>
                <td className="align-top p-3 border">Popular when ownership isn’t essential but you want lower rentals, VAT on rentals, and flexibility at the end.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          *VAT treatment varies by circumstance (e.g. your VAT status and how the van is used). Always confirm with your accountant.
          <br />
          **Accounting depends on your reporting framework (e.g. IFRS 16 or UK GAAP/FRS 102) and materiality. This is a general overview, not advice.
        </p>
      </section>

      {/* Worked example: FL pattern */}
      <section className="mt-10 grid md:grid-cols-2 gap-6">
        <div className="border rounded p-5 bg-slate-50">
          <h3 className="text-lg font-semibold">Finance Lease — worked example (illustrative)</h3>
          <p className="mt-2 text-sm text-slate-700">
            Suppose an offer is shown at <strong>£299.50 ex‑VAT / month</strong> for 36 months at <strong>10k miles/year</strong>
            with a <strong>9× initial payment</strong> (typical of many medium vans like a Vito).
          </p>
          <ul className="mt-3 text-sm text-slate-700 list-disc pl-5 space-y-1">
            <li>Initial payment: <strong>9 × £299.50 = £2,695.50 ex‑VAT</strong> (VAT added to this payment at the prevailing rate).</li>
            <li>Then <strong>35 monthly rentals</strong> at £299.50 ex‑VAT (again, VAT added to each rental).</li>
            <li>No transfer of ownership at the end. Options are typically to continue at a nominal rent or sell on the lessor’s behalf and share proceeds (per agreement).</li>
          </ul>
          <p className="mt-2 text-xs text-slate-500">Figures are examples only and exclude fees/changes. Not a quote.</p>
        </div>
        <div className="border rounded p-5">
          <h3 className="text-lg font-semibold">Hire Purchase — cash‑flow pattern (illustrative)</h3>
          <p className="mt-2 text-sm text-slate-700">
            Assume a hypothetical <strong>vehicle cash price £30,000 + VAT</strong> and a <strong>10% deposit</strong>.
          </p>
          <ul className="mt-3 text-sm text-slate-700 list-disc pl-5 space-y-1">
            <li><strong>VAT up‑front:</strong> £6,000 (reclaim subject to your VAT position and use).</li>
            <li><strong>Deposit:</strong> £3,000 (10% of the cash price).</li>
            <li><strong>Amount financed:</strong> ~£27,000 (ignoring fees). Monthly instalments depend on term and APR.</li>
            <li><strong>Ownership:</strong> transfers to you after the final payment (and any option fee).</li>
          </ul>
          <p className="mt-2 text-xs text-slate-500">Illustrative only; your actual deposit, APR and terms will vary.</p>
        </div>
      </section>

      {/* Balloons */}
      <section className="mt-10 border rounded p-5">
        <h3 className="text-lg font-semibold">Finance Lease with a balloon</h3>
        <p className="mt-2 text-sm text-slate-700">
          You can lower monthly rentals by setting a <strong>final (balloon) payment</strong> due when the van is sold at the end of the term.
          Set the balloon sensibly — higher expected mileage usually means a lower balloon, because resale value will likely be lower.
        </p>
      </section>

      {/* BVRLA fair wear & tear */}
      <section className="mt-10 border rounded p-5">
        <h2 className="text-xl font-semibold">Fair wear &amp; tear (BVRLA guidance)</h2>
        <p className="mt-2 text-sm text-slate-700">
          End‑of‑term inspections generally follow <strong>BVRLA fair wear &amp; tear</strong> principles. In simple terms:
        </p>
        <div className="mt-3 grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold">Usually acceptable</h3>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-700">
              <li>Light, age‑related surface marks and small chips that don’t expose bare metal.</li>
              <li>Minor scuffs to wheel trims; tyres meeting legal tread and condition standards.</li>
              <li>Interior wear consistent with age and mileage; fully functioning equipment.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Usually chargeable</h3>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-700">
              <li>Accident damage, deep dents, cracked lights or windscreens, corrosion.</li>
              <li>Tyres below legal tread, mismatched or damaged wheels beyond refurbishment.</li>
              <li>Missing keys, documents, or service history; un‑repaired warning lights or faults.</li>
            </ul>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">Always check your specific funder’s return standards for definitive criteria.</p>
      </section>

      {/* Which is right? */}
      <section className="mt-10 grid md:grid-cols-2 gap-6">
        <div className="border rounded p-5">
          <h2 className="text-xl font-semibold">Choose HP if you…</h2>
          <ul className="mt-2 text-sm text-slate-700 list-disc pl-5 space-y-1">
            <li>want to <strong>own</strong> the van at the end;</li>
            <li>expect to keep it long‑term or value modifications;</li>
            <li>are comfortable with the larger upfront VAT + deposit.</li>
          </ul>
        </div>
        <div className="border rounded p-5">
          <h2 className="text-xl font-semibold">Choose Finance Lease if you…</h2>
          <ul className="mt-2 text-sm text-slate-700 list-disc pl-5 space-y-1">
            <li>don’t need legal ownership but want full use of the van;</li>
            <li>prefer VAT to be paid on the rentals over time;</li>
            <li>want flexibility at the end (continue renting or sell on behalf of the lessor).</li>
          </ul>
        </div>
      </section>

      {/* FAQs */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Frequently asked questions</h2>
        <div className="mt-4 space-y-3">
          <FAQ q="Is maintenance included?">
            Maintenance is optional. If you add it, servicing, routine wear items and breakdown cover are included per the plan.
          </FAQ>
          <FAQ q="Can I change the mileage later?">
            You can usually request a mileage amendment during the term (subject to funder approval). Changing mileage will adjust your monthly rental.
          </FAQ>
          <FAQ q="Is there a mileage penalty on Finance Lease?">
            Finance Lease itself doesn’t set a mileage penalty like contract hire, but high mileage can reduce the resale price at the end, which may affect any proceeds share.
          </FAQ>
          <FAQ q="Who insures and maintains the van?">
            You arrange insurance and routine maintenance unless you add a maintenance package. You must keep the van roadworthy and serviced per the schedule.
          </FAQ>
          <FAQ q="Can I settle early?">
            Early settlement may be possible but fees/charges can apply. Ask us for a settlement figure from the funder.
          </FAQ>
        </div>
      </section>

      {/* CTA band */}
      <section className="mt-10 border rounded p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Talk to our team</h2>
          <p className="text-slate-700">Not sure which route suits your business? Our specialists can explain options and tailor live offers.</p>
        </div>
        <div className="flex gap-2">
          <a href="/vans" className="px-4 py-2 rounded border">Browse vans</a>
          <a href="/contact" className="px-4 py-2 rounded bg-primary text-white">Get advice</a>
        </div>
      </section>

      {/* Small print */}
      <p className="mt-10 text-xs text-slate-500">
        E‑Van Leasing is a credit broker, not a lender. Finance subject to status. Figures and examples on this page are for guidance only and do not constitute tax, accounting or financial advice. Please seek professional advice specific to your business.
      </p>
    </div>
  );
}

function AtGlance({ title, points }: { title: string; points: string[] }) {
  return (
    <div className="border rounded p-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      <ul className="mt-2 text-sm text-slate-700 list-disc pl-5 space-y-1">
        {points.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
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