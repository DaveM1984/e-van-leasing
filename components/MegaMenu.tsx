'use client';
import { useEffect, useRef, useState } from 'react';

export function MegaMenu() {
  const [open, setOpen] = useState(false);
  const [level, setLevel] = useState<'root' | 'leasing'>('root');
  const firstFocusable = useRef<HTMLButtonElement | null>(null);

  // Lock scroll when the mobile menu is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on Escape and reset level when closing
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (level === 'leasing') setLevel('root');
        else setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [level]);

  useEffect(() => {
    if (open && firstFocusable.current) firstFocusable.current.focus();
  }, [open]);

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

  const NavLink = (
    { href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }
  ) => (
    <a
      href={href}
      className="block w-full text-left py-3"
      onClick={() => {
        setOpen(false);
        onClick?.();
      }}
    >
      {children}
    </a>
  );

  return (
    <div className="relative">
      {/* Mobile trigger */}
      <div className="md:hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu-root"
          className="h-10 inline-flex items-center px-3 rounded border"
          onClick={() => {
            setLevel('root');
            setOpen((v) => !v);
          }}
          ref={firstFocusable}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Desktop mega menu (unchanged) */}
      <div className="hidden md:flex items-center gap-6">
        <div className="group relative">
          <button className="py-2">Van Leasing</button>
          <div className="absolute left-0 top-full hidden group-hover:block bg-white border shadow p-4 w-[680px]">
            <DesktopMega />
          </div>
        </div>
        <a href="/compare" className="py-2">Compare</a>
        <a href="/about" className="py-2">About</a>
        <a href="/contact" className="py-2">Contact</a>
      </div>

      {/* Mobile drawers */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Root drawer */}
          <div
            id="mobile-menu-root"
            className={
              'absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-white shadow-xl border-l transition-transform duration-300 ' +
              (level === 'root' ? 'translate-x-0' : 'translate-x-full')
            }
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold">Menu</h2>
              <button className="text-sm underline" onClick={() => setOpen(false)}>Close</button>
            </div>
            <nav className="p-2">
              <button className="w-full text-left py-3 font-medium" onClick={() => setLevel('leasing')}>Van Leasing</button>
              <NavLink href="/compare">Compare</NavLink>
              <NavLink href="/about">About</NavLink>
              <NavLink href="/contact">Contact</NavLink>
            </nav>
          </div>

          {/* Leasing drawer (second level) */}
          <div
            id="mobile-menu-leasing"
            className={
              'absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-white shadow-xl border-l transition-transform duration-300 ' +
              (level === 'leasing' ? 'translate-x-0' : 'translate-x-full')
            }
            aria-hidden={level !== 'leasing'}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <button className="text-sm underline" onClick={() => setLevel('root')}>Back</button>
              <h2 className="font-semibold">Van Leasing</h2>
              <button className="text-sm underline" onClick={() => setOpen(false)}>Close</button>
            </div>
            <nav className="p-4 text-sm">
              <div className="mb-4">
                <p className="font-semibold mb-2">Makes</p>
                <div className="grid grid-cols-2 gap-x-4">
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
                <div className="grid grid-cols-2 gap-x-4">
                  <a href="/electric-vans" onClick={() => setOpen(false)}>Electric & Hybrid</a>
                  <a href="/pickups" onClick={() => setOpen(false)}>Pickups</a>
                  <a href="/vans?bodyType=Panel%20Van" onClick={() => setOpen(false)}>Panel Van</a>
                  <a href="/vans?bodyType=DCIV" onClick={() => setOpen(false)}>Crew Van (DCIV)</a>
                  <a href="/vans?bodyType=Tipper" onClick={() => setOpen(false)}>Tipper</a>
                  <a href="/vans?bodyType=Dropside" onClick={() => setOpen(false)}>Dropside</a>
                  <a href="/vans?bodyType=Refrigerated" onClick={() => setOpen(false)}>Refrigerated</a>
                </div>
              </div>

              <div>
                <p className="font-semibold mb-2">More</p>
                <div className="grid grid-cols-2 gap-x-4">
                  <a href="/vans?budget=under-250" onClick={() => setOpen(false)}>Under £250</a>
                  <a href="/vans?budget=250-350" onClick={() => setOpen(false)}>£250–£350</a>
                  <a href="/vans?budget=350-plus" onClick={() => setOpen(false)}>£350+</a>
                  <a href="/van-leasing-explained" onClick={() => setOpen(false)}>Leasing explained</a>
                  <a href="/van-finance" onClick={() => setOpen(false)}>Finance options</a>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

function DesktopMega() {
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
  );
}