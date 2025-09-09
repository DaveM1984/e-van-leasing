'use client';
import Link from 'next/link';
import { useCompareStore } from '@/store/compare';

export function CompareTray({ offer }: { offer: any }) {
  const { ids, add, remove } = useCompareStore();
  const has = ids.includes(offer.id);
  return (
    <div className="mt-6 border rounded p-3 flex items-center justify-between">
      <div className="text-sm">Compare this offer with up to 3 others.</div>
      <button
        className="px-3 py-2 rounded border"
        onClick={() => (has ? remove(offer.id) : add(offer.id))}
      >
        {has ? 'Remove from compare' : 'Add to compare'}
      </button>
      <Link href="/compare" className="underline text-primary">Go to compare ({ids.length})</Link>
    </div>
  );
}