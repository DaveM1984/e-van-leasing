import './globals.css';
import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'E-Van Leasing', template: '%s | E-Van Leasing' },
  description:
    'Flexible van leasing across the UK. Small, medium, large vans and pickups with road tax included and no admin fees.',
  openGraph: {
    type: 'website',
    title: 'E-Van Leasing',
    url: '/',
    images: ['/brand/e-van-leasing-logo.png']
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'E-Van Leasing',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    logo: '/brand/e-van-leasing-logo.png',
    contactPoint: [{ '@type': 'ContactPoint', telephone: '07852789688', contactType: 'sales' }]
  };
  return (
    <html lang="en">
      <body className="font-sans text-slate-800">
        <a href="#main" className="sr-only focus:not-sr-only p-2 bg-white">
          Skip to content
        </a>
        <Header />
        <main id="main" className="min-h-[60vh]">{children}</main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
      </body>
    </html>
  );
}