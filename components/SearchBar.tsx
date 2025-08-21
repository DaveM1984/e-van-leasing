'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import makes from '@/data/makes.json';

export function SearchBar() {
  const r = useRouter();
  const [type, setType] = useState<string>('');
  const [make, setMake] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [budget, setBudget] = useState<string>('');

  useEffect(() => { setModel(''); }, [make]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (type) params.set('bodyType', type);
        if (make) params.set('make', make);
        if (model) params.set('model', model);
        if (budget) params.set('budget', budget);
        r.push(`/vans?${params.toString()}`);
      }}
      className="grid md:grid-cols-5 gap-3"
    >
      <select aria-label="Type" className="input" value={type} onChange={(e)=>setType(e.target.value)}>
        <option value="">Type</option>
        <option value="Panel Van">Panel Van</option>
        <option value="DCIV">Crew Van (DCIV)</option>
        <option value="Tipper">Tipper</option>
        <option value="Dropside">Dropside</option>
        <option value="Refrigerated">Refrigerated</option>
      </select>
      <select aria-label="Make" className="input" value={make} onChange={(e)=>setMake(e.target.value)}>
        <option value="">Make</option>
        {makes.map((m)=> <option key={m} value={m}>{m}</option>)}
      </select>
      <select aria-label="Model" className="input" value={model} onChange={(e)=>setModel(e.target.value)}>
        <option value="">Model</option>
        {make && mockModelsByMake(make).map((m)=> <option key={m} value={m}>{m}</option>)}
      </select>
      <select aria-label="Budget" className="input" value={budget} onChange={(e)=>setBudget(e.target.value)}>
        <option value="">Budget</option>
        <option value="under-250">Under £250</option>
        <option value="250-350">£250–£350</option>
        <option value="350-plus">£350+</option>
      </select>
      <button className="px-4 py-2 rounded bg-primary text-white">Search deals</button>
      <style jsx>{`.input{@apply border rounded px-3 py-2 w-full;}`}</style>
    </form>
  );
}

function mockModelsByMake(make: string) {
  const map: Record<string, string[]> = {
    Ford: ['Transit Custom', 'Transit', 'Ranger'],
    'Mercedes-Benz': ['Vito', 'Sprinter'],
    Volkswagen: ['Transporter', 'Crafter'],
    Vauxhall: ['Vivaro', 'Combo']
  };
  return map[make] || ['Popular model'];
}