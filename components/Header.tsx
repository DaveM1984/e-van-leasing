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
          {/* Mobile WhatsApp icon */}
          <a
            href="https://wa.me/447852789688"
            target="_blank"
            rel="noopener noreferrer"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded border"
            aria-label="Chat on WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
              <path d="M20.52 3.48A11.86 11.86 0 0012 0C5.37 0 0 5.37 0 12c0 2.12.55 4.2 1.6 6.04L0 24l6.17-1.61A11.93 11.93 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22a9.93 9.93 0 01-5.06-1.38l-.36-.22-3.65.95.98-3.56-.24-.37A9.92 9.92 0 012 12C2 6.48 6.48 2 12 2c2.67 0 5.18 1.04 7.07 2.93A9.93 9.93 0 0122 12c0 5.52-4.48 10-10 10zm5.08-7.88c-.28-.14-1.64-.81-1.9-.9-.26-.1-.45-.14-.64.14-.19.28-.74.9-.9 1.08-.17.18-.33.2-.61.07-.28-.14-1.18-.44-2.25-1.41-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.12-.12.28-.33.42-.49.14-.16.19-.28.28-.47.09-.18.05-.35-.02-.49-.07-.14-.64-1.54-.88-2.11-.23-.55-.47-.47-.64-.48h-.55c-.19 0-.49.07-.74.35-.26.28-1 1-1 2.44 0 1.44 1.02 2.83 1.16 3.02.14.18 2 3.06 4.85 4.29.68.29 1.21.46 1.62.59.68.22 1.29.19 1.77.12.54-.08 1.64-.67 1.87-1.32.23-.65.23-1.2.16-1.32-.07-.12-.26-.19-.54-.33z"/>
            </svg>
          </a>
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