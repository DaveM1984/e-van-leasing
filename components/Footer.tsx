export function Footer() {
  return (
    <footer className="border-t mt-8">
      <div className="mx-auto max-w-6xl px-4 py-8 grid md:grid-cols-4 gap-6 text-sm">
        <div>
          <p className="font-semibold">Company</p>
          <ul className="mt-2 space-y-1">
            <li><a href="/about" className="hover:underline">About</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">Legal</p>
          <ul className="mt-2 space-y-1">
            <li><a href="/privacy">Privacy</a></li>
            <li><a href="/terms">Terms</a></li>
            <li><a href="/cookie-policy">Cookie Policy</a></li>
            <li><a href="/complaints">Complaints</a></li>
            <li><a href="/treating-customers-fairly">Treating Customers Fairly</a></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">Contact</p>
          <p>Tel: 07852789688<br/>Email: sales@e-van-leasing.co.uk</p>
          <p className="mt-2">172 Orrell Rd, Orrell, Wigan WN5 8HQ</p>
        </div>
        <div>
          <p className="font-semibold">Regulatory</p>
          <p>Company: 07567558</p>
          <p>FCA FRN: <strong>TODO</strong></p>
          <p>ICO: <strong>TODO</strong></p>
        </div>
      </div>
      <div className="text-center text-xs text-slate-500 pb-6">
        © {new Date().getFullYear()} E-Van Leasing. Broker, not lender.
      </div>
    </footer>
  );
}