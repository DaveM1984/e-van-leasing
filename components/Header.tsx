'use client';
import Image from 'next/image';
import { MegaMenu } from './MegaMenu';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center gap-4">
        <a href="/" className="flex items-center">
          <Image
            src="/brand/e-van-leasing-logo.png"
            alt="E-Van Leasing"
            width={140}
            height={32}
            priority
          />
          <span className="sr-only">E-Van Leasing</span>
        </a>
        <nav className="ml-auto">
          <MegaMenu />
        </nav>
        <a href="tel:07852789688" className="ml-4 text-sm font-medium">07852789688</a>
        <a href="mailto:sales@e-van-leasing.co.uk" className="hidden sm:block text-sm underline">
          sales@e-van-leasing.co.uk
        </a>
      </div>
      <div className="bg-slate-50 text-center text-xs py-1">E-Van Leasing is a credit broker, not a lender.</div>
    </header>
  );
}