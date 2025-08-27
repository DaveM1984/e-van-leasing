export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Hero */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Contact us</h1>
        <p className="mt-2 text-slate-700 max-w-2xl">
          Speak to our team about van leasing, availability, and finance options. We’re happy to help.
        </p>
      </header>

      {/* Top CTAs */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Call */}
        <a href="tel:07852789688" className="group border rounded p-4 flex items-center gap-4 hover:shadow">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded border">
            {/* phone icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path d="M2.25 6.75c0-1.243 1.007-2.25 2.25-2.25h2.17c.93 0 1.74.598 2.02 1.486l.77 2.43a2.25 2.25 0 01-.57 2.31l-1.09 1.09a12.06 12.06 0 005.28 5.28l1.09-1.09a2.25 2.25 0 012.31-.57l2.43.77a2.25 2.25 0 011.486 2.02v2.17c0 1.243-1.007 2.25-2.25 2.25H18A15.75 15.75 0 012.25 6.75V6.75z" />
            </svg>
          </span>
          <div>
            <p className="text-sm text-slate-600">Call us</p>
            <p className="text-lg font-semibold group-hover:underline">07852789688</p>
            <p className="text-xs text-slate-500">Mon–Fri 9am–5:30pm</p>
          </div>
        </a>

        {/* WhatsApp */}
        <a
          href="https://wa.me/447852789688"
          target="_blank"
          rel="noopener noreferrer"
          className="group border rounded p-4 flex items-center gap-4 hover:shadow"
        >
          <span className="inline-flex h-12 w-12 items-center justify-center rounded border">
            {/* whatsapp icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path d="M20.52 3.48A11.86 11.86 0 0012 0C5.37 0 0 5.37 0 12c0 2.12.55 4.2 1.6 6.04L0 24l6.17-1.61A11.93 11.93 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22a9.93 9.93 0 01-5.06-1.38l-.36-.22-3.65.95.98-3.56-.24-.37A9.92 9.92 0 012 12C2 6.48 6.48 2 12 2c2.67 0 5.18 1.04 7.07 2.93A9.93 9.93 0 0122 12c0 5.52-4.48 10-10 10zm5.08-7.88c-.28-.14-1.64-.81-1.9-.9-.26-.1-.45-.14-.64.14-.19.28-.74.9-.9 1.08-.17.18-.33.2-.61.07-.28-.14-1.18-.44-2.25-1.41-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.12-.12.28-.33.42-.49.14-.16.19-.28.28-.47.09-.18.05-.35-.02-.49-.07-.14-.64-1.54-.88-2.11-.23-.55-.47-.47-.64-.48h-.55c-.19 0-.49.07-.74.35-.26.28-1 1-1 2.44 0 1.44 1.02 2.83 1.16 3.02.14.18 2 3.06 4.85 4.29.68.29 1.21.46 1.62.59.68.22 1.29.19 1.77.12.54-.08 1.64-.67 1.87-1.32.23-.65.23-1.2.16-1.32-.07-.12-.26-.19-.54-.33z"/>
            </svg>
          </span>
          <div>
            <p className="text-sm text-slate-600">WhatsApp</p>
            <p className="text-lg font-semibold group-hover:underline">Message our team</p>
            <p className="text-xs text-slate-500">Fast replies during opening hours</p>
          </div>
        </a>

        {/* Email */}
        <a href="mailto:sales@e-van-leasing.co.uk" className="group border rounded p-4 flex items-center gap-4 hover:shadow">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded border">
            {/* mail icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path d="M1.5 6.75A2.25 2.25 0 013.75 4.5h16.5A2.25 2.25 0 0122.5 6.75v10.5A2.25 2.25 0 0120 19.5H3.75A2.25 2.25 0 011.5 17.25V6.75zm2.636-.75a.75.75 0 00-.636.342l7.255 5.442a1.5 1.5 0 001.77 0l7.255-5.442a.75.75 0 00-.636-.342H4.136z" />
            </svg>
          </span>
          <div>
            <p className="text-sm text-slate-600">Email</p>
            <p className="text-lg font-semibold group-hover:underline">sales@e-van-leasing.co.uk</p>
            <p className="text-xs text-slate-500">We aim to reply within 1 business day</p>
          </div>
        </a>
      </section>

      {/* Info panels */}
      <section className="mt-8 grid lg:grid-cols-3 gap-6">
        {/* Opening hours */}
        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-3">Opening hours</h2>
          <dl className="text-sm grid grid-cols-2 gap-y-2">
            <dt className="text-slate-600">Monday–Friday</dt><dd>9:00am – 5:30pm</dd>
            <dt className="text-slate-600">Saturday</dt><dd>Closed</dd>
            <dt className="text-slate-600">Sunday</dt><dd>Closed</dd>
          </dl>
          <p className="text-xs text-slate-500 mt-3">Bank holiday hours may vary.</p>
        </div>

        {/* Address */}
        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-3">Address</h2>
          <address className="not-italic text-sm">
            172 Orrell Rd<br />
            Orrell, Wigan WN5 8HQ
          </address>
          <a
            className="mt-3 inline-flex items-center gap-2 text-sm underline text-primary"
            href="https://maps.google.com/?q=172%20Orrell%20Rd%20Wigan%20WN5%208HQ"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get directions
          </a>
        </div>

        {/* FAQs */}
        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-3">Help & FAQs</h2>
          <p className="text-sm text-slate-700">Find quick answers about pricing, mileage, delivery and more.</p>
          <a href="/van-leasing-explained" className="mt-3 inline-block px-3 py-2 rounded border">View FAQs</a>
        </div>
      </section>

      {/* Small print */}
      <p className="mt-10 text-xs text-slate-500">E-Van Leasing is a credit broker, not a lender.</p>
    </div>
  );
}