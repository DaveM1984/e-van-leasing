'use client';
export function MegaMenu() {
  const link = (href: string, label: string) => (
    <a key={href} href={href} className="hover:underline block py-1">{label}</a>
  );
  return (
    <div className="flex items-center gap-6">
      <div className="group relative">
        <button className="py-2">Van Leasing</button>
        <div className="absolute left-0 top-full hidden group-hover:block bg-white border shadow p-4 w-[680px]">
          <div className="grid grid-cols-3 gap-6 text-sm">
            <div>
              <p className="font-semibold mb-2">By Manufacturer</p>
              {['Ford','Vauxhall','Volkswagen','Mercedes-Benz','Renault','Peugeot','Citroën','Fiat','Toyota','Nissan','Maxus','IVECO','Isuzu','MAN'].map((m)=>link(`/vans/${encodeURIComponent(m)}`, m))}
            </div>
            <div>
              <p className="font-semibold mb-2">By Type</p>
              {link('/electric-vans','Electric & Hybrid')}
              {link('/pickups','Pickups')}
              {link('/vans?bodyType=Panel%20Van','Panel Van')}
              {link('/vans?bodyType=DCIV','Crew Van (DCIV)')}
              {link('/vans?bodyType=Tipper','Tipper')}
              {link('/vans?bodyType=Dropside','Dropside')}
              {link('/vans?bodyType=Refrigerated','Refrigerated')}
            </div>
            <div>
              <p className="font-semibold mb-2">More</p>
              {link('/vans?budget=under-250','Under £250')}
              {link('/vans?budget=250-350','£250–£350')}
              {link('/vans?budget=350-plus','£350+')}
              {link('/van-leasing-explained','Leasing explained')}
              {link('/van-finance','Finance options')}
            </div>
          </div>
        </div>
      </div>
      <a href="/compare" className="py-2">Compare</a>
      <a href="/about" className="py-2">About</a>
      <a href="/contact" className="py-2">Contact</a>
    </div>
  );
}