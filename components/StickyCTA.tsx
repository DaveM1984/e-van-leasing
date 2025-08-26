'use client';
import { useEffect, useState } from 'react';

export function StickyCTA({ price }: { price: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!visible) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <span className="font-semibold">From £{price.toFixed(2)} ex-VAT / month</span>
        <a href="#enquiry" className="px-4 py-2 bg-primary text-white rounded" aria-label="Jump to enquiry form">Request a quote</a>
      </div>
    </div>
  );
}