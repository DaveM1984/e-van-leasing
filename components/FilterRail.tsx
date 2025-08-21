'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import makes from '@/data/makes.json';

export function FilterRail() {
  const sp = useSearchParams();
  const r = useRouter();

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(sp);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    r.push(`/vans?${next.toString()}`);
  }

  return (
    <div className="space-y-4">
      <Select id="make" label="Make" value={sp.get('make') || ''} onChange={(v)=>setParam('make', v)}>
        <option value="">Any</option>
        {makes.map((m)=> <option key={m} value={m}>{m}</option>)}
      </Select>
      <Select id="bodyType" label="Body type" value={sp.get('bodyType') || ''} onChange={(v)=>setParam('bodyType', v)}>
        {['','Panel Van','DCIV','Tipper','Dropside','Refrigerated'].map((b,i)=> <option key={i} value={b}>{b || 'Any'}</option>)}
      </Select>
      <Select id="fuel" label="Fuel" value={sp.get('fuel') || ''} onChange={(v)=>setParam('fuel', v)}>
        {['','Diesel','Petrol','Hybrid','Electric'].map((f,i)=> <option key={i} value={f}>{f || 'Any'}</option>)}
      </Select>
      <Select id="budget" label="Budget" value={sp.get('budget') || ''} onChange={(v)=>setParam('budget', v)}>
        <option value="">Any</option>
        <option value="under-250">Under £250</option>
        <option value="250-350">£250–£350</option>
        <option value="350-plus">£350+</option>
      </Select>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={sp.get('inStock') === 'true'}
          onChange={(e)=>setParam('inStock', e.target.checked ? 'true' : '')}
        />
        In stock
      </label>
    </div>
  );
}

function Select({
  id, label, value, onChange, children
}: { id: string; label: string; value: string; onChange: (v:string)=>void; children: React.ReactNode }) {
  return (
    <label htmlFor={id} className="grid gap-1 text-sm">
      <span className="font-medium">{label}</span>
      <select id={id} value={value} onChange={(e)=>onChange(e.target.value)} className="border rounded px-3 py-2 w-full">
        {children}
      </select>
    </label>
  );
}