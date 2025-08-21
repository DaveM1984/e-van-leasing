'use client';
import { useEffect, useState } from 'react';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const v = localStorage.getItem('cookie-consent');
    if (!v) setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col sm:flex-row gap-3 items-center justify-between text-sm">
        <p>
          We use cookies to improve your experience. See our{' '}
          <a href="/cookie-policy" className="underline">Cookie Policy</a>.
        </p>
        <div className="flex gap-2">
          <button
            className="px-3 py-2 rounded border"
            onClick={() => { localStorage.setItem('cookie-consent', 'prefs'); setShow(false); }}
          >
            Preferences
          </button>
          <button
            className="px-3 py-2 rounded bg-primary text-white"
            onClick={() => { localStorage.setItem('cookie-consent', 'all'); setShow(false); }}
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}