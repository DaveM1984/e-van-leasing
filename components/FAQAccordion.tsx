'use client';
import { useState } from 'react';
export function FAQAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y border rounded">
      {items.map((it, i) => (
        <details key={i} open={open === i} onToggle={(e)=> setOpen((e.target as HTMLDetailsElement).open ? i : null)}>
          <summary className="cursor-pointer px-4 py-3 font-medium">{it.q}</summary>
          <div className="px-4 pb-4 text-sm text-slate-700">{it.a}</div>
        </details>
      ))}
    </div>
  );
}