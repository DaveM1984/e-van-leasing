'use client';
import { useEffect, useState } from 'react';

export function MegaMenu() {
  const [open, setOpen] = useState(false);

  // Lock scroll when the mobile menu is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const link = (href: string, label: string) => (
    <a key={href} href={href} className="hover:underline block py-1">
      {label}
    </a>
  );

  const manufacturers = [
    'Ford',
    'Vauxhall',
    'Volkswagen',
    'Mercedes-Benz',
    'Renault',
    'Peugeot',
    'Citroën',
    'Fiat',
    'Toyota',
    'Nissan',
    'Maxus',
    'IVECO',
    'Isuzu',
    'MAN'
  ];

  return (
    <div className="relative">
      {/* Mobile trigger */}
      <div className="md:hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu-panel"
          className="py-2 px-3 rounded border"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Desktop mega menu (unchanged) */}
      <div className="hidden md:flex items-center gap-6">
        <div className="group relative">
          <button className="py-2">Van Leasing</button>
          <div className="absolute left-0 top-full hidden group-hover:block bg-white border shadow p-4 w-[680px]">
            <div className="grid grid-cols-3 gap-6 text-sm">
              <div>
                <p className="font-semibold mb-2">By Manufacturer</p>
                {manufacturers.map((m) => link(`/vans/${encodeURIComponent(m)}`, m))}
              </div>
              <div>
                <p className="font-semibold mb-2">By Type</p>
                {link('/electric-vans', 'Electric & Hybrid')}
                {link('/pickups', 'Pickups')}
                {link('/vans?bodyType=Panel%20Van', 'Panel Van')}
                {link('/vans?bodyType=DCIV', 'Crew Van (DCIV)')}
                {link('/vans?bodyType=Tipper', 'Tipper')}
                {link('/vans?bodyType=Dropside', 'Dropside')}
                {link('/vans?bodyType=Refrigerated', 'Refrigerated')}
              </div>
              <div>
                <p className="font-semibold mb-2">More</p>
                {link('/vans?budget=under-250', 'Under £250')}
                {link('/vans?budget=250-350', '£250–£350')}
                {link('/vans?budget=350-plus', '£350+')}
                {link('/van-leasing-explained', 'Leasing explained')}
                {link('/van-finance', 'Finance options')}
              </div>
            </div>
          </div>
        </div>
        <a href="/compare" className="py-2">Compare</a>
        <a href="/about" className="py-2">About</a>
        <a href="/contact" className="py-2">Contact</a>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            id="mobile-menu-panel"
            className="absolute inset-x-0 top-16 bg-white border-t shadow-lg p-4 max-h-[calc(100vh-64px)] overflow-y-auto"
          >
            <nav className="text-sm">
              <div className="mb-4">
                <p className="font-semibold mb-2">Van Leasing</p>
                <div className="grid grid-cols-2 gap-2">
                  {manufacturers.map((m) => (
                    <a
                      key={m}
                      href={`/vans/${encodeURIComponent(m)}`}
                      className="py-1"
                      onClick={() => setOpen(false)}
                    >
                      {m}
                    </a>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="font-semibold mb-2">By Type</p>
                <div className="grid grid-cols-2 gap-2">
                  <a href="/electric-vans" onClick={() => setOpen(false)}>Electric & Hybrid</a>
                  <a href="/pickups" onClick={() => setOpen(false)}>Pickups</a>
                  <a href="/vans?bodyType=Panel%20Van" onClick={() => setOpen(false)}>Panel Van</a>
                  <a href="/vans?bodyType=DCIV" onClick={() => setOpen(false)}>Crew Van (DCIV)</a>
                  <a href="/vans?bodyType=Tipper" onClick={() => setOpen(false)}>Tipper</a>
                  <a href="/vans?bodyType=Dropside" onClick={() => setOpen(false)}>Dropside</a>
                  <a href="/vans?bodyType=Refrigerated" onClick={() => setOpen(false)}>Refrigerated</a>
                </div>
              </div>

              <div className="mb-4">
                <p className="font-semibold mb-2">More</p>
                <div className="grid grid-cols-2 gap-2">
                  <a href="/vans?budget=under-250" onClick={() => setOpen(false)}>Under £250</a>
                  <a href="/vans?budget=250-350" onClick={() => setOpen(false)}>£250–£350</a>
                  <a href="/vans?budget=350-plus" onClick={() => setOpen(false)}>£350+</a>
                  <a href="/van-leasing-explained" onClick={() => setOpen(false)}>Leasing explained</a>
                  <a href="/van-finance" onClick={() => setOpen(false)}>Finance options</a>
                </div>
              </div>

              <div className="border-t pt-3 grid grid-cols-2 gap-2">
                <a href="/compare" onClick={() => setOpen(false)}>Compare</a>
                <a href="/about" onClick={() => setOpen(false)}>About</a>
                <a href="/contact" onClick={() => setOpen(false)}>Contact</a>
              </div>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}