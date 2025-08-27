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
        <div className="ml-auto flex items-center gap-2">
          {/* Mobile phone icon (same height as menu button) */}
          <a
            href="tel:07852789688"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded border"
            aria-label="Call us"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M2.25 6.75c0-1.243 1.007-2.25 2.25-2.25h2.17c.93 0 1.74.598 2.02 1.486l.77 2.43a2.25 2.25 0 01-.57 2.31l-1.09 1.09a12.06 12.06 0 005.28 5.28l1.09-1.09a2.25 2.25 0 012.31-.57l2.43.77a2.25 2.25 0 011.486 2.02v2.17c0 1.243-1.007 2.25-2.25 2.25H18A15.75 15.75 0 012.25 6.75V6.75z" />
            </svg>
          </a>

          {/* Menu */}
          <nav>
            <MegaMenu />
          </nav>

          {/* Desktop phone number */}
          <a href="tel:07852789688" className="hidden md:inline ml-4 text-sm font-medium">07852789688</a>

          {/* Desktop email */}
          <a href="mailto:sales@e-van-leasing.co.uk" className="hidden sm:block text-sm underline">
            sales@e-van-leasing.co.uk
          </a>
        </div>
      </div>
      <div className="bg-slate-50 text-center text-xs py-1">E-Van Leasing is a credit broker, not a lender.</div>
    </header>
  );
}