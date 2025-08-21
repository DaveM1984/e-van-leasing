export function LogoCloud({ className = '' }: { className?: string }) {
  return (
    <div className={`border-t pt-8 ${className}`}>
      <p className="text-sm text-slate-600 mb-3">Popular manufacturers</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 text-sm">
        {['Ford','Vauxhall','Volkswagen','Mercedes-Benz','Renault','Peugeot','Citroën','Fiat','Toyota','Nissan','Maxus','IVECO','Isuzu','MAN'].map((m)=>(
          <a key={m} className="border rounded p-3 text-center hover:bg-slate-50" href={`/vans/${encodeURIComponent(m)}`}>{m}</a>
        ))}
      </div>
    </div>
  );
}